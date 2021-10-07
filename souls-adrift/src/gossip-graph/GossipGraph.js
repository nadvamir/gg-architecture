import murmurhash from "murmurhash"
import { Action } from "../game-engine/actions/ActionFactory"
import { MessageType } from "./MessageType"
import { serialise, deserialise } from './MessageSerialiser.js'

class GossipGraph {
    constructor() {
        this.listeners = []
        this.lastHash = 0
        this.messageId = 0

        this.connections = {}
        this.peers = {}
        this.activePeers = {}
    }

    init(id, WSClass, PeerClass, wrtc) {
        this.id = id
        this.wrtc = wrtc
        this.PeerClass = PeerClass

        let ws = new WSClass('ws://localhost:3001')
        this.ws = ws
        ws.addEventListener('open', () => {
            ws.send(JSON.stringify({ action: 'register', uid: this.id }))
        })
        ws.addEventListener('message', (event) => {
            const payload = JSON.parse(event.data || event.toString())
            switch (payload.action) {
                case 'game_state':
                    this.initGameState(payload.state)
                    break
                case 'list_of_peers':
                    this.initiateConnection(payload.peers)
                    break;
                case 'signal':
                    this.handleSignal(payload.uid, payload.sdp)
                    break
                default:
                    console.log(payload.action, 'could not be matched')
            }
        })
    }

    addListener(onMessageReceived) {
        this.listeners.push(onMessageReceived)
    }

    formMessage(type, actions) {
        return {
            type: type,
            actions: actions,
            sender: this.id,
            lastHash: this.lastHash,
            messageId: this.messageId++,
            time: new Date().getTime()
        }
    }

    send(type, action, args, peers) {
        const payload = {
            action: action,
            args: args,
            origSender: this.id
        }
        this.lastHash = murmurhash.v3(JSON.stringify(payload) + this.lastHash)
        payload.origLastHash = this.lastHash
        const message = JSON.stringify(this.formMessage(type, [payload]))
        //TODO: GG instead of client-server
        if (0 in this.activePeers) { // not a server
            this.activePeers[0].send(message)
        }
        else {
            this.handleIncomingMessage(message, true)
        }
        return this.lastHash
    }

    //TODO: sort out serialisation
    initGameState(state) {
        state.uid = this.id
        for (let listener of this.listeners) {
            listener(0, MessageType.DIRECT_MESSAGE, Action.OverwriteState, [state], this.lastHash, state.time)
        }
    }

    decodeIncoming(data, fromServerSend) {
        data = JSON.parse(data)
        if (!fromServerSend && this.isServer() && data.type != MessageType.DIRECT_MESSAGE) {
            // rewrite the message as if coming from the server
            data = this.formMessage(data.type, data.actions)
        }
        return data
    }

    handleIncomingMessage(data, fromServerSend = false) {
        const message = this.decodeIncoming(data, fromServerSend)
        const { type, actions, sender, lastHash, time, messageId } = message

        //TODO: proper gossip graph
        if (this.isServer()) {
            data = (fromServerSend) ? data : JSON.stringify(message)
            for (const peer of Object.values(this.activePeers)) {
                peer.send(data)
            }
        }

        if (sender != 0) {
            // do the gossip graph instead of registering events
            return
        }

        for (let listener of this.listeners) {
            for (const { action, args, origSender, origLastHash } of actions) {
                //FIXME: don't hack in UID in state overwrites
                if (action == Action.OverwriteState) {
                    args[0].uid = this.id
                }
                listener(origSender, type, action, args, origLastHash, time, messageId)
            }
        }
    }

    get selfId() {
        return this.id
    }

    isServer() {
        return this.id == 0
    }

    newPeer(config, pid) {
        config.trickle = false
        // config.config = {iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]}
        config.config = { iceServers: [] }
        if (this.wrtc) {
            config.wrtc = this.wrtc
        }
        let peer = new this.PeerClass(config)
        peer.on('signal', data => {
            // send an answer
            console.log(this.id, ' signalling to ', pid)
            this.ws.send(JSON.stringify({ action: 'signal', uid: this.id, peer: pid, sdp: data }))
        })
        peer.on('connect', () => {
            console.log(pid, 'connected!')
            this.activePeers[pid] = peer
        })
        peer.on('data', data => {
            this.handleIncomingMessage(data.toString())
        })
        peer.on('error', (err) => {
            console.log('ERROR for id', this.id, 'message=', err)
        })
        peer.on('close', () => {
            console.log('Removing WebRTC')
            delete this.peers[pid]
            delete this.activePeers[pid]
        })
        return peer
    }

    initiateConnection(peers) {
        peers.forEach(pid => {
            const peer = this.newPeer({ initiator: true }, pid)
            this.peers[pid] = peer
        })
    }

    handleSignal(pid, sdp) {
        if (!(pid in this.peers)) {
            // this is an offer
            const peer = this.newPeer({}, pid)
            this.peers[pid] = peer
        }
        // else == an answer; signal in both cases
        this.peers[pid].signal(sdp)
    }
}

export { GossipGraph }