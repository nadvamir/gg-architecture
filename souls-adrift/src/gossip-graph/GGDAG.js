class GGDAG {
    constructor() {
        this.events = []
    }

    // creating a unique event of your own
    addEvent(payload) {
        this.events.push(payload)
    }

    // incoming data from other peers
    acceptGossip(events) {
        events.forEach(e => this.events.push(e))
        return {ban: []}
    }

    // used to form a message to a peer
    getUnseenEvents(peer) {
        return []
    }

    // used to drive the internal game engine
    getEventsWhichHappenedAfter(eventId) {
        return []
    }

    size() {
        return this.events.length
    }
}

export { GGDAG }