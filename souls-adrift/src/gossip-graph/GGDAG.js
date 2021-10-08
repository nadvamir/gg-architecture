import murmurhash from "murmurhash"

class GGDAG {
    constructor(id, lastEvent) {
        this.id = id
        this.gg = {}
        this.lastEvent = lastEvent
    }

    recordEvent(op, payload) {
        const [sp, eid] = this.lastEvent[this.id]
        let event = {
            eid: eid + 1,
            s: this.id,
            sp: sp,
            op: op,
            t: new Date().getTime(),
            p: payload
        }
        event.th = murmurhash.v3(JSON.stringify(event))
        this.gg[event.th] = event
        this.lastEvent[this.id] = [event.th, event.eid]
    }

    // creating a unique event of your own
    addEvent(payload) {
        this.recordEvent(null, {})
    }

    // incoming data from other peers
    acceptGossip(events) {
        const finalEventCandidates = new Set()
        events.forEach(e => {
            if (e.th in this.gg) return // we already know about this event
            // store in the graph
            this.gg[e.th] = e
            // attempt to discover which event is the final one for the record purposes
            if (finalEventCandidates.has(e.sp)) finalEventCandidates.delete(e.sp)
            if (finalEventCandidates.has(e.op)) finalEventCandidates.delete(e.op)
            finalEventCandidates.add(e.th)
            // update last events for a given sender
            if (this.lastEvent[e.s][1] < e.eid) {
                this.lastEvent[e.s] = [e.th, e.eid]
            }
        })
        // create an event recording gossip received
        for (const h of finalEventCandidates.values()) {
            this.recordEvent(h, {})
        }
        return {ban: []}
    }

    // used to form a message to a peer
    getUnseenEvents(peer) {
        const seen = new Set(this.eventsSeenFrom(this.lastEvent[peer][0]))
        return Object.values(this.gg).filter(e => !seen.has(e.th))
    }

    // used to drive the internal game engine
    getEventsWhichHappenedAfter(eventHash) {
        const happenedBefore = new Set(this.eventsSeenFrom(eventHash))
        return this.eventsSeenFrom(this.lastEvent[0][0], happenedBefore).map(e => this.gg[e])
    }

    compact() {

    }

    peerSummary() {
        return this.lastEvent
    }

    size() {
        return Object.keys(this.gg).length
    }

    eventsSeenFrom(node, rejectSet = null) {
        let result = []
        let q = [node]
        while (q.length != 0) {
            let hash = q.shift()
            let event = this.gg[hash]
            if (!event) continue
            if (rejectSet && rejectSet.has(hash)) continue
            result.push(hash)
            q.push(event.sp)
            if (event.op) q.push(event.op)
        }
        return result
    }
}

export { GGDAG }