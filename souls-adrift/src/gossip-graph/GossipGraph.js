import murmurhash from "murmurhash"
import { Action } from "../game-engine/actions/ActionFactory"
import { MessageType } from "./MessageType"
import { deepCopy } from "../game-client/util/Util"
import { Metrics } from "./Metrics"

class GossipGraph {
    constructor() {
        this.listeners = []
        this.lastHash = 0
        this.messageId = 0

        this.connections = {}
        this.peers = {}
        this.activePeers = {}
        this.numActivePeers = 0

        this.lastMessages = {}
        this.numLastMessages = 0
        this.actionHistory = []

        this.metrics = new Metrics()
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
            origSender: this.id,
            origTime: new Date().getTime()
        }
        this.lastHash = murmurhash.v3(JSON.stringify(payload) + this.lastHash)
        this.timeSent = new Date().getTime()
        payload.origLastHash = this.lastHash
        const message = this.formMessage(type, [payload])
        //TODO: GG instead of client-server
        if (0 in this.activePeers) { // not a server
            this.sendToPeer(this.activePeers[0], JSON.stringify(message))
        }
        else {
            this.handleIncomingMessage(message, true)
        }
        return this.lastHash
    }

    sendToPeer(peer, msg) {
        this.metrics.recordTrafficOut(msg.length)
        peer.send(msg)
    }

    //TODO: sort out serialisation
    initGameState(state) {
        state.uid = this.id
        for (let listener of this.listeners) {
            listener(0, MessageType.DIRECT_MESSAGE, Action.OverwriteState, [state], this.lastHash, state.time)
        }
    }

    decodeIncoming(data, fromServerSend) {
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
            this.broadcastMessage(message)
        }

        if (sender != 0) {
            // do the gossip graph instead of registering events
            return
        }

        for (let listener of this.listeners) {
            for (const { action, args, origSender, origLastHash, origTime } of actions) {
                //FIXME: don't hack in UID in state overwrites
                if (action == Action.OverwriteState) {
                    args[0].uid = this.id
                }
                if (origLastHash == this.lastHash) {
                    this.metrics.recordLatency(new Date().getTime() - origTime)
                }
                listener(origSender, type, action, args, origLastHash, time, messageId)
            }
        }
    }

    broadcastMessage(message) {
        this.actionHistory.push(message)
        const justLatest = JSON.stringify(message)
        for (const [pid, peer] of Object.entries(this.activePeers)) {
            const lastSeen = this.lastMessages[pid]
            if (lastSeen == message.messageId - 1) {
                this.sendToPeer(peer, justLatest)
            }
            else {
                const msgCopy = deepCopy(message)
                msgCopy.actions = this.actionHistory
                    .filter(msg => msg.messageId > lastSeen)
                    .map(msg => msg.actions[0]) //TODO: flatmap
                this.sendToPeer(peer, JSON.stringify(msgCopy))
            }
            this.lastMessages[pid] = message.messageId
        }
        // trim action history
        if (this.numLastMessages == this.numActivePeers) {
            this.actionHistory.length = 0
        }
        else {
            const minMsgId = Math.min(Object.values(this.lastMessages))
            this.actionHistory = this.actionHistory.filter(m => m.messageId > minMsgId)
        }
    }

    markLastMessage(pid, messageId) {
        if (pid != 0) {
            this.lastMessages[pid] = messageId
            this.numLastMessages += 1
        }
    }

    get selfId() {
        return this.id
    }

    getMetrics() {
        return this.metrics.getMetrics()
    }

    isServer() {
        return this.id == 0
    }

    newPeer(config, pid) {
        config.trickle = false
        // config.config = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }
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
            this.numActivePeers += 1
        })
        peer.on('data', data => {
            const msg = data.toString()
            this.metrics.recordTrafficIn(msg.length)
            this.handleIncomingMessage(JSON.parse(msg))
        })
        peer.on('error', (err) => {
            console.log('ERROR for id', this.id, 'message=', err)
        })
        peer.on('close', () => {
            console.log('Removing WebRTC')
            delete this.peers[pid]
            delete this.activePeers[pid]
            delete this.lastMessages[pid]
            this.numActivePeers -= 1
            this.numLastMessages -= 1
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