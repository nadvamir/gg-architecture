import murmurhash from "murmurhash"
import { Action } from "../game-engine/actions/ActionFactory"
import { MessageType } from "./MessageType"
import { serialise, deserialise } from './MessageSerialiser.js'

class GossipGraph {
    constructor() {
        this.listeners = []
        this.lastHash = 0

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

    send(type, action, args, peers) {
        let message = serialise(action, args)
        this.lastHash = murmurhash.v3(message + this.lastHash)
        message = type + '~' + this.id + '~' + this.lastHash + '~' + message
        //TODO: GG instead of client-server
        if (0 in this.activePeers) { // not a server
            this.activePeers[0].send(message)
        }
        else {
            this.handleIncomingMessage(message)
        }
        return this.lastHash
    }

    //TODO: sort out serialisation
    initGameState(state) {
        state.uid = this.id
        for (let listener of this.listeners) {
            listener(0, MessageType.DIRECT_MESSAGE, Action.OverwriteState, [state], this.lastHash, new Date().getTime())
        }
    }

    handleIncomingMessage(data) {
        //TODO: proper gossip graph
        if (this.isServer()) {
            // forward to others
            for (const peer of Object.values(this.activePeers)) {
                peer.send(data)
            }
        }
        const [type, senderId, lastHash, message] = data.split('~')
        const [action, args] = deserialise(message)
        //FIXME: don't hack in UID in state overwrites
        if (action == Action.OverwriteState) {
            args[0].uid = this.id
        }
        for (let listener of this.listeners) {
            setTimeout(_ => listener(senderId, type, action, args, lastHash, new Date().getTime()), Math.random() * 1000)
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