import murmurhash from "murmurhash"
import { Action } from "../game-engine/actions/ActionFactory"
import { MessageType } from "./MessageType"

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

    send(type, message) {
        this.lastHash = murmurhash.v3(message + this.lastHash)
        for (let listener of this.listeners) {
            setTimeout(_ => listener(this.id, type, message, this.lastHash, new Date().getTime()), Math.random() * 1000)
        }
        if (0 in this.activePeers) {
            this.activePeers[0].send(message)
        }
        return this.lastHash
    }

    //TODO: sort out serialisation
    initGameState(state) {
        state.uid = this.id
        const message = Action.OverwriteState + '|' + JSON.stringify(state)
        for (let listener of this.listeners) {
            listener(0, MessageType.DIRECT_MESSAGE, message, this.lastHash, new Date().getTime())
        }
    }

    get selfId() {
        return this.id
    }

    newPeer(config, pid) {
        if (this.wrtc) {
            config.wrtc = this.wrtc
        }
        let peer = new this.PeerClass(config)
        peer.on('signal', data => {
            // send an answer
            this.ws.send(JSON.stringify({ action: 'signal', uid: this.id, peer: pid, sdp: data }))
        })
        peer.on('connect', () => {
            console.log(pid, 'connected!')
            this.activePeers[pid] = peer
        })
        peer.on('data', data => {
            console.log('Direct data received', data.toString())
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