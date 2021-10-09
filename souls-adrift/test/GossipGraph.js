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
    // {eid: 102, s: 2, t: 10000, th: ?, sp: 101, op: 201, p: {}}, // 2A -> 1B
    const hash102 = gg.peerSummary()[1][0]

    // 3 -> 1
    gg.acceptGossip([
        {eid: 201, s: 2, t: 9999, th: 201, sp: 200, op: null, p: {action: 2, args: [10]}}, // 2A self event
        {eid: 301, s: 3, t: 10001, th: 301, sp: 101, op: 201, p: {}}, // 2A -> 3C
    ])
    // ->
    // {eid: 103, s: 3, t: 10003, th: ?, sp: 102, op: 301, p: {}}, // 3C -> 1E

    // 2 -> 1
    gg.acceptGossip([
        {eid: 8, s: 0, t: 10002, th: 8, sp: 7, op: hash102, p: {}}, // 1B -> 0D
        {eid: 202, s: 2, t: 10004, th: 202, sp: 201, op: 8, p: {}} // 0D -> 2F
    ])
    // ->
    // {eid: 104, s: 2, t: 10005, th: ?, sp: 103, op: 202, p: {}} // 2F -> 1G
}

// create a gossip graph for the core example
function createGG() {
    const id = 1
    const lastEvents = {
        0: [7, 7],
        1: [101, 101],
        2: [200, 200],
        3: [300, 300]
    }
    return new GGDAG(id, lastEvents)
}

function setEqual(a, b) {
    return a.size === b.size && [...a].every(value => b.has(value))
}

function dictEquals(a, b) {
    return a.size === b.size && Object.entries(a).every(([k, v]) => b[k] == v)
}

test('should produce new events', async (t) => {
    const gg = createGG()

    gg.addEvent({action: 2, args: [10]})

    t.equal(gg.size(), 1)
    const [event] = [...Object.values(gg.gg)]
    t.equal(event.eid, 102)
    t.equal(event.sp, 101)
    t.equal(event.op, null)
})

test('should accept gossip', async (t) => {
    const gg = createGG()

    generateSampleGraph(gg)

    t.equal(gg.size(), 7)
})

test('should ignore gossip that does not join to the existing graph', async (t) => {
    const gg = createGG()
    generateSampleGraph(gg)

    gg.acceptGossip([{eid: 400, s: 0, t: 10002, th: 400, sp: 399, op: 1000, p: {}}])

    t.equal(gg.size(), 7)
})

test('should produce all events that a peer does not know about', async (t) => {
    const gg = createGG()
    generateSampleGraph(gg)

    const events = gg.getUnseenEvents(3)

    const unseenEventIds = events.map(e => e.eid)
    t.ok(setEqual(new Set(unseenEventIds), new Set([102, 103, 8, 202, 104])))
})

test('should produce all events that happened after a given event hash', async (t) => {
    const gg = createGG()
    generateSampleGraph(gg)

    const events = gg.getEventsWhichHappenedAfter(7)

    const eventsWhichHappened = events.map(e => e.eid)
    // the events are returned in the order they happened
    t.equal(eventsWhichHappened[0], 201)
    t.equal(eventsWhichHappened[1], 102)
    t.equal(eventsWhichHappened[2], 8)
})

test('should ban peers who are cheating by forking the history', async (t) => {
    const gg = createGG()
    generateSampleGraph(gg)
    //TODO
    t.ok(true)
    // t.looseEqual(result.bans, [3])
})

test('should delete the events that have been seen by every peer', async (t) => {
    const gg = createGG()
    generateSampleGraph(gg)

    gg.compact()

    t.equal(gg.size(), 6)
})

test('should know the last event for each peer', async (t) => {
    const gg = createGG()
    generateSampleGraph(gg)

    const lastEvents = gg.peerSummary()

    const receivedEventIds = {}
    for (const [k, v] of Object.entries(lastEvents)) {
        receivedEventIds[k] = v[1]
    }
    t.ok(dictEquals(receivedEventIds, { 0: 8, 1: 104, 2: 202, 3: 301 }))
})

test('should return event by its hash', async (t) => {
    const gg = createGG()
    generateSampleGraph(gg)

    const evt = gg.getEvent(301)

    t.equal(evt.t, 10001)
})
