import murmurhash from "murmurhash"

class GossipGraph {
    constructor() {
        this.listeners = []
        this.lastHash = 0

        this.connections = {}
    }

    init(id, WSClass) {
        this.id = id

        let ws = new WSClass('ws://localhost:3001')
        ws.addEventListener('open', () => {
            ws.send(JSON.stringify({action: 'register', uid: this.id}))
        })
        ws.addEventListener('message', (event) => {
            const payload = JSON.parse(event.data || event.toString())
            console.log('Client received: ', payload)
            switch (payload.action) {
                case 'list_of_peers':
                    payload.peers.forEach(p => {
                        ws.send(JSON.stringify({action: 'signal', uid: this.id, peer: p, sdp: 'RANDOM_TEXT'}))
                    })
                    break;
                case 'signal':
                    console.log(this.id, 'received:', payload)
                    break
                default:
                    console.log(payload.action, 'could not be matched')
            }
        })
        this.ws = ws
    }

    addListener(onMessageReceived) {
        this.listeners.push(onMessageReceived)
    }

    send(type, message) {
        this.lastHash = murmurhash.v3(message + this.lastHash)
        for (let listener of this.listeners) {
            setTimeout(_ => listener(this.id, type, message, this.lastHash, new Date().getTime()), Math.random() * 1000)
        }
        return this.lastHash
    }

    get selfId() {
        return this.id
    }
}

export { GossipGraph }