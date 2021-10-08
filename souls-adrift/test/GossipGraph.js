import { GGDAG } from '../src/gossip-graph/GGDAG.js'
const test = require('tape')

test('should produce new events', async (t) => {
    const gg = new GGDAG(1)
    gg.addEvent({})
    t.equal(gg.size(), 1)
})

test('should accept gossip', async (t) => {
    const gg = new GGDAG(1)
    gg.acceptGossip([{}, {}, {}])
    t.equal(gg.size(), 3)
})

test('should produce all events that a peer does not know about', async (t) => {
    const gg = new GGDAG(1)
    gg.acceptGossip([{}, {}, {}])
    const events = gg.getUnseenEvents(3)
    t.equal(events, {})
})

test('should produce all events that happened after a given event id', async (t) => {
    const gg = new GGDAG(1)
    gg.acceptGossip([{}, {}, {}])
    const events = gg.getEventsWhichHappenedAfter(2)
    t.equal(events, {})
})

test('should ban peers who are cheating by forking the history', async (t) => {
    const gg = new GGDAG(1)
    const result = gg.acceptGossip([{}, {}, {}])
    t.equal(result.bans, [3])
})