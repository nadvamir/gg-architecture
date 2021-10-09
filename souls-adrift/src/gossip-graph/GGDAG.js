import murmurhash from "murmurhash"
import BitSet from "bitset"
import { deepCopy } from "../game-client/util/Util"

class GGDAG {
    constructor(id, lastEvent) {
        this.id = id
        this.gg = {}
        this.lastEvent = lastEvent
        this.origLastEvent = deepCopy(lastEvent)
        // console.log('Initial setup: ', this.origLastEvent)
    }

    getEvent(hash) {
        return this.gg[hash]
    }

    recordEvent(op, payload, events) {
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

        const last = [event.th, event.eid]
        this.lastEvent[this.id] = last
        return last
    }

    // creating a unique event of your own
    addEvent(payload) {
        return this.recordEvent(null, payload)
    }

    // incoming data from other peers
    acceptGossip(events) {
        if (events.length == 0) return

        // verify that the gossip does not create a forest
        // const newNodes = new Set(events.map(e => e.th))
        // const lastNodes = new Set(Object.values(this.origLastEvent).map(l => l[0]))
        // const joins = (h) => h in this.gg || newNodes.has(h) || lastNodes.has(h)
        // for (const e of events) {
        //     if (!!e.op && !joins(e.op)) {
        //         // console.log(e, 'does not join because of op to', this.gg)
        //         if (!this.printed) {
        //             console.log(e, 'does not join because of op to', this.gg)
        //             console.log('orig last', this.origLastEvent)
        //             console.log('new', newNodes, newNodes.has(e.sp))
        //             console.log('events', events)
        //             this.printed = true
        //         }
        //         return { ban: [] }
        //     }
        // }

        // join to the graph
        let lastAdded = null
        events.forEach(e => {
            if (e.th in this.gg) return // we already know about this event
            // store in the graph
            this.gg[e.th] = e
            lastAdded = e.th
            // update last events for a given sender
            if (!this.lastEvent[e.s] || this.lastEvent[e.s][1] < e.eid) {
                this.lastEvent[e.s] = [e.th, e.eid]
            }
        })
        // create an event recording gossip received
        if (lastAdded) {
            this.recordEvent(lastAdded, {}, events)
        }
        return { ban: [] }
    }

    // used to form a message to a peer
    getUnseenEvents(peer) {
        const lastForPeer = this.lastEvent[peer]
        const seen = new Set(lastForPeer && this.eventsSeenFrom(lastForPeer[0]) || [])
        return this.eventsSeenFrom(this.lastEvent[this.id][0], seen).map(e => this.gg[e]).reverse()
    }

    // used to drive the internal game engine
    getEventsWhichHappenedAfter(eventHash) {
        if (eventHash == this.lastEvent[0][0]) return [] // commonly nothing happened
        const happenedBefore = new Set(this.eventsSeenFrom(eventHash))
        return this.eventsSeenFrom(this.lastEvent[0][0], happenedBefore).map(e => this.gg[e]).reverse()
    }

    compact() {
        // create a mapping from the source to bitset idx
        const mapping = Object.fromEntries(Object.keys(this.lastEvent).map((id, idx) => [id, idx]))

        // our target -- all bits flipped
        const target = new BitSet()
        target.flip(0, mapping.length)

        const numSeers = {}

        const self = this
        let seen = new Set()
        function dfs(node, visitedSet, lastId) {
            if (seen.has(node)) return
            seen.add(node)
            const event = self.gg[node]
            if (event.s != lastId) visitedSet = visitedSet.or(mapping[event.s])

            if (!(node in numSeers)) numSeers[node] = visitedSet
            else numSeers[node] = numSeers[node].or(visitedSet)

            if (numSeers[node].equals(target)) {
                delete self.gg[node]
            }

            if (event.sp in self.gg) dfs(event.sp, visitedSet, event.s)
            if (event.op in self.gg) dfs(event.op, visitedSet, event.s)
        }

        // can start from a final node in any of the peers really
        const lastHappened = this.lastEvent[0][0]
        if (this.gg[lastHappened]) {
            dfs(lastHappened, new BitSet(), -1)
        }
    }

    peerSummary() {
        return this.lastEvent
    }

    peerSummaryAsOf(hash) {
        const lastEvents = {}
        function visit(hash) {
            const event = this.gg[hash]
            if (!event) return
            if (!(event.s in lastEvents)) lastEvents[event.s] = [hash, event.eid]
            visit(event.op)
        }
        return lastEvents
    }

    size() {
        return Object.keys(this.gg).length
    }

    eventsSeenFrom(node, rejectSet = null) {
        let result = []
        let q = [node]
        let seen = new Set([])
        while (q.length != 0) {
            let hash = q.shift()
            let event = this.gg[hash]
            if (!event) continue
            if (rejectSet && rejectSet.has(hash)) continue
            if (seen.has(hash)) continue
            seen.add(hash)
            result.push(hash)
            q.push(event.sp)
            if (event.op) q.push(event.op)
        }
        return result
    }
}

export { GGDAG }