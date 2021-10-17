import { Action } from "../game-engine/actions/ActionFactory"
import { MessageType } from "./MessageType"
import { Metrics } from "./Metrics"
import { GGDAG } from "./GGDAG"

class GossipGraph {
    constructor() {
        this.listeners = []
        this.lastHash = 0
        this.messageId = 0

        this.connections = {}
        this.peers = {}
        this.activePeers = {}
        this.numActivePeers = 0
        this.initialPeerList = new Set()

        this.metrics = new Metrics()
        this.gg = null

        this.hadServerResponse = false
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
                    this.setupGG(payload.peers, payload.state.last_event_hash)
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
        //TODO: support direct messages
        const payload = { action: action, args: args }
        // record the message in the graph:
        this.lastHash = this.gg.addEvent(payload)[0]
        // No need to actually send -- GG communicates the updates in the background
        // but if it's a server process, need to handle the message
        if (this.isServer()) {
            const evt = this.gg.getEvent(this.lastHash)
            for (const listener of this.listeners) {
                listener(0, MessageType.GG_MESSAGE, action, args, this.lastHash, evt.t, [evt.th, evt.eid])
            }
        }
        else {
            this.hasEvent = true
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
            listener(0, MessageType.SERVER_MESSAGE, Action.OverwriteState, [state], this.lastHash, state.time, [this.lastHash, 0])
        }
        this.initiated = true
    }

    setupGG(peers, lastEventHash) {
        this.gg = new GGDAG(this.id, peers)
        // record the game server block
        if (!this.isServer()) this.gg.recordEvent(lastEventHash, {})
        setInterval(() => this.gossip(), 100) // 10x per second
        setInterval(() => this.gg.compact(), 1000)
    }

    decodeIncoming(data, fromServerSend) {
        if (!fromServerSend && this.isServer() && data.type == MessageType.GG_MESSAGE) {
            // rewrite the message as if coming from the server
            data = this.formMessage(data.type, data.actions)
        }
        return data
    }

    handleIncomingMessage(data) {
        // console.log('Incoming: ', data.length, 'gg size:', this.gg.size())
        // if (data.length > 1) {
        //     console.log(data)
        //     console.log(this.gg.gg)
        // }
        // if not a server, drop a message with no events
        if (this.initiated && this.hadServerResponse && !this.isServer()) {
            let hasInterestingPayload = data.find((evt) => evt.p.action !== undefined) !== undefined
            hasInterestingPayload = hasInterestingPayload || data.length > 0 && data[data.length-1].s == 0
            if (!hasInterestingPayload) return
        }

        const happenedLast = this.gg.peerSummary()[0][0]
        // store the messages in the gossip-graph
        this.gg.acceptGossip(data)
        // process events that happened
        const events = this.gg.getEventsWhichHappenedAfter(happenedLast)
        // console.log(events.length, 'happend after', happenedLast, 'gg size:', this.gg.size())
        if (events.length > 0) {
            const server = events[events.length-1] // keep track of last server event, even if empty
            for (const e of events) {
                if (e.p.action === undefined) continue
                if (e.s) console.log(e.s, 'did', e.p.action, 'gg', this.gg.size())
                if (e.th == this.lastHash) {
                    this.metrics.recordLatency(new Date().getTime() - e.t)
                }
                for (let listener of this.listeners) {
                    listener(e.s, MessageType.GG_MESSAGE, e.p.action, e.p.args, e.th, e.t, [server.th, server.eid])
                }
            }
        }
    }

    gossip() {
        // choose a random peer
        const peers = Object.keys(this.activePeers)
        if (peers.length == 0) return
        const pid = ((!this.hasEvent && this.hadServerResponse) || this.isServer()) ? peers[Math.floor(peers.length * Math.random())] : peers[0]
        const message = JSON.stringify(this.gg.getUnseenEvents(pid))
        // if (!this.printed && pid == "3000002") {
        //     this.printed = true
        //     console.log("LETS DEBUG")
        //     console.log('UNseen')
        //     console.log(this.gg.getUnseenEvents(pid))
        //     console.log('Full graph')
        //     console.log(this.gg.gg)
        //     console.log('Last events')
        //     console.log(this.gg.peerSummary())
        //     // throw new Error("STOPPING")
        // }
        // console.log('gossip ', this.id, ' -> ', pid)
        this.sendToPeer(this.activePeers[pid], message)
        this.hasEvent = false
    }

    markLastMessage(pid, lastMsg) {
        this.gg.lastEvent[pid] = lastMsg
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
            // Only communicate with peers where it's us who must establish the connection
            if (this.initialPeerList.has(pid)) {
                console.log('INITIATING CONNECTION TO', pid)
                this.activePeers[pid] = peer
                this.numActivePeers += 1
            }
        })
        peer.on('data', data => {
            const msg = data.toString()
            this.metrics.recordTrafficIn(msg.length)
            const parsed = JSON.parse(msg)
            if (!(pid in this.activePeers) && parsed.length > 0) {
                console.log('FIRST DATA FROM', pid)
                // peers reaching out, can start communicating with them
                this.activePeers[pid] = peer
                this.numActivePeers += 1
            }
            this.handleIncomingMessage(JSON.parse(msg))
            if (pid == 0) this.hadServerResponse = true
        })
        peer.on('error', (err) => {
            console.log('ERROR for id', this.id, 'message=', err)
        })
        peer.on('close', () => {
            console.log('Removing WebRTC')
            delete this.peers[pid]
            delete this.activePeers[pid]
            this.numActivePeers -= 1
        })
        return peer
    }

    initiateConnection(peers) {
        this.initialPeerList = new Set(peers)
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