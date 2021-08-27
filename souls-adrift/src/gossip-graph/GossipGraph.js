import murmurhash from "murmurhash"

class GossipGraph {
    constructor(id, publicKey, privateKey) {
        this.id = id
        this.publicKey = publicKey
        this.privateKey = privateKey
        this.listeners = []

        this.lastHash = 0
    }

    addListener(onMessageReceived) {
        this.listeners.push(onMessageReceived)
    }

    send(type, message) {
        this.lastHash = murmurhash.v3(message + this.lastHash)
        for (let listener of this.listeners) {
            setTimeout(_ => listener(this.id, type, message, this.lastHash), Math.random() * 1000)
        }
        return this.lastHash
    }

    get selfId() {
        return this.id
    }
}

export { GossipGraph }