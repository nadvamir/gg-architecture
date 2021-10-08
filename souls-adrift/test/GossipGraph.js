import { GGDAG } from '../src/gossip-graph/GGDAG.js'
const test = require('tape')

// Example graph
/*
    G
      \
    --- F
  / E _
D       \____
  \           C
    B      /
       \  /       
        A
0   1   2    3
*/

// generating this example graph
function generateSampleGraph(gg) {
    // 2 -> 1
    gg.acceptGossip([
        {eid: 201, s: 2, t: 9999, th: 201, sp: 200, op: null, p: {action: 2, args: [10]}}, // 2A self event
    ])
    // ->
    // {eid: 102, s: 2, t: 10000, th: 102, sp: 101, op: 201, p: {}}, // 2A -> 1B

    // 3 -> 1
    gg.acceptGossip([
        {eid: 201, s: 2, t: 9999, th: 201, sp: 200, op: null, p: {action: 2, args: [10]}}, // 2A self event
        {eid: 301, s: 2, t: 10001, th: 301, sp: 101, op: 201, p: {}}, // 2A -> 3C
    ])
    // ->
    // {eid: 103, s: 3, t: 10003, th: 103, sp: 102, op: 301, p: {}}, // 3C -> 1E

    // 2 -> 1
    gg.acceptGossip([
        {eid: 8, s: 1, t: 10002, th: 8, sp: 7, op: 102, p: {}}, // 1B -> 0D
        {eid: 202, s: 0, t: 10004, th: 202, sp: 201, op: 8, p: {}} // 0D -> 2F
    ])
    // ->
    // {eid: 104, s: 2, t: 10005, th: 104, sp: 103, op: 202, p: {}} // 2F -> 1G
}

// create a gossip graph for the core example
function createGG() {
    const id = 1
    const lastEvents = {
        0: [7, 7],
        2: [200, 200],
        3: [300, 300]
    }
    return new GGDAG(id, lastEvents)
}

test('should produce new events', async (t) => {
    const gg = createGG()

    gg.addEvent({action: 2, args: [10]})

    t.equal(gg.size(), 1)
})

test('should accept gossip', async (t) => {
    const gg = createGG()

    generateSampleGraph(gg)

    t.equal(gg.size(), 7)
})

test('should produce all events that a peer does not know about', async (t) => {
    const gg = createGG()
    generateSampleGraph(gg)

    const events = gg.getUnseenEvents(3)

    const unseenEventIds = events.map(e => e.eid)
    t.equal(new Set(unseenEventIds), new Set([102, 103, 8, 202, 104]))
})

test('should produce all events that happened after a given event id', async (t) => {
    const gg = createGG()
    generateSampleGraph(gg)

    const events = gg.getEventsWhichHappenedAfter(7)

    const eventsWhichHappened = events.map(e => e.eid)
    t.equal(new Set(eventsWhichHappened), new Set([201, 102, 8]))
})

test('should ban peers who are cheating by forking the history', async (t) => {
    const gg = createGG()
    generateSampleGraph(gg)
    //TODO
    t.equal(result.bans, [3])
})

test('should delete the events that have been seen by every peer', async (t) => {
    const gg = createGG()
    generateSampleGraph(gg)

    gg.compact()

    t.equal(gg.size(), 1)
})

test('should know the last event for each peer', async (t) => {
    const gg = createGG()
    generateSampleGraph(gg)

    const lastEvents = gg.peerSummary()

    const receivedEventIds = {}
    for (const [k, v] of Object.entries(lastEvents)) {
        receivedEventIds[k] = v[1]
    }
    t.equal(receivedEventIds, { 0: 0, 1: 104, 2: 204, 3: 301 })

})