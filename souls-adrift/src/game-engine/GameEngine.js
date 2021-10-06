import { createStore, produce } from 'solid-js/store';

import { MessageType } from '../gossip-graph/MessageType.js'
import { Player } from './Player.js'
import { Npc } from './Npc.js'
import { Item } from './Item.js'
import { Location } from './Location.js'
import { Action } from "./actions/ActionFactory";
import { deepCopy } from '../game-client/util/Util.js';
import { AI } from './AI.js';
import { ItemDefinitions } from './data/ItemDefinitions.js';
import { NpcDefinitions } from './data/NpcDefinitions.js';
import { Reflection } from './util/Reflection.js';

const DESPAWN_PERIOD = 30 * 60 * 1000 // 30 minutes
const RESPAWN_PERIOD = 5 * 60 * 1000 // 5 minutes

class GameEngine {
    constructor(gossipGraph) {
        this.gossipGraph = gossipGraph
        this.onMessageReceived = this.onMessageReceived.bind(this)
        this.gossipGraph.addListener(this.onMessageReceived)

        const [state, setState] = createStore({
            loaded: false,
            messages: []
        })
        this.state = state
        this.setState = setState

        this.entityCache = {}

        const [interactionState, setInteractionState] = createStore({
            sending: false
        })
        this.interactionState = interactionState
        this.setInteractionState = setInteractionState

        // Used to serialise UI commands
        this.nextHash = null

        // AI that will control automated actions
        this.ai = new AI(this)
    }

    isServer() {
        return true
        return this.state.uid == this.serverId()
    }

    send(action, args) {
        this.setInteractionState({ sending: true })
        console.log('Sending!')
        this.nextHash = this.gossipGraph.send(MessageType.GG_MESSAGE, action, args)
    }

    sendToLoc(location, action, args) {
        //TODO: send direct messages to everyone in the graph
        this.send(action, args)
    }

    sendHeartbeat() {
        // advancing game timer from the server
        this.send(Action.None, [this.state.uid])
    }

    onMessageReceived(sender, type, action, args, hash, time) {
        if (!this.authorised(sender, type, action, args)) {
            console.log('Received an unauthorised message')
            return
        }

        // Clear the event list to keep it manageable
        if (sender == this.state.uid) {
            this.clearEventList()
        }

        this.updateTime(time)
        if (action != Action.OverwriteState) {
            this.ai.run(time)
        }
        this.handleEvent(action, args)
        if (hash == this.nextHash) {
            console.log('Received')
            this.setInteractionState({ sending: false })
        }
    }

    recordEvent(message) {
        this.setState('messages', produce(messages => {
            messages.push([new Date(), message])
        }))
    }

    clearEventList() {
        this.setState('messages', produce(messages => {
            messages.length = 0
        }))
    }

    getState() {
        return this.state
    }

    getInteractionState() {
        return this.interactionState
    }

    loadGameState(state) {
        this.setState(state)

        // generate entity cache
        for (const id of Object.keys(this.state)) {
            this.get(id)
        }

        if (this.isServer()) {
            setInterval(() => this.sendHeartbeat(), 1000)
        }
    }

    // ------------ Synchronised random ------------
    rand() {
        //TODO: create a custom calculator seeded by event hash
        return Math.round(Math.random() * 100)
    }

    gameTime() {
        return this.state.time
    }

    updateTime(time) {
        this.setState(produce(state => {
            state.time = time
        }))
    }

    // ----------------- Accessors -----------------
    get(id) {
        const cachedEntity = this.entityCache[id]
        if (!!cachedEntity) {
            // update state
            cachedEntity.state = this.state[id] || cachedEntity.state
            return cachedEntity
        }

        const entity = this.state[id]
        if (!entity || !entity.src) {
            return
        }
        if (typeof id == "string") id = parseInt(id, 10)
        const creator = () => {
            switch (entity.src[0]) {
                case 'l': return new Location(id, entity, this)
                case 'n': return new Npc(id, entity, this)
                case 'i': return new Item(id, entity, this)
                case 'p': return new Player(id, entity, this)
            }
        }

        const instance = creator()
        if (!instance) {
            return
        }
        this.entityCache[id] = instance
        return instance
    }

    moneyId() {
        return 2000005
    }

    money() {
        return this.get(this.moneyId())
    }

    serverId() {
        return 0
    }

    playerId() {
        return this.state.uid
    }

    player() {
        return this.get(this.playerId())
    }

    regionSpawnPoint() {
        return this.get(this.state.region_spawn_point)
    }

    getAITime(timer) {
        return this.state.ai[timer]
    }

    aliveActors() {
        let actors = []
        for (const [id, val] of Object.entries(this.state)) {
            if (!val.src) continue
            if (val.src[0] != 'n' && val.src[0] != 'p') continue
            actors.push(this.get(id))
        }
        return actors
    }

    // ------------ Event Handling -----------------
    // check the author had a right to submit this event
    authorised(sender, type, action, args) {
        if (sender == this.serverId()) return true
        if (action == Action.OverwriteState) return false
        return !!args && sender == args[0]
    }

    handleEvent(action, args) {
        const processor = Action.getProcessor(action)
        processor(args, this)
    }

    // --------------- Modifiers -----------------
    nextId() {
        this.setState(produce(state => {
            state.last_id += 1
        }))
        return this.state.last_id
    }

    remove(actor) {
        delete this.entityCache[actor.id]
        this.setState(produce(state => {
            delete state[actor.id]
        }))
    }

    enqueueRespawn(actor, locationId, count = 1) {
        this.setState('spawn_queue', produce(queue => {
            const respawnPeriod = actor.state.respawn_period || RESPAWN_PERIOD
            const marker = Reflection.isNpc(actor) ? actor.state.src : actor.id
            queue.push([marker, count, locationId, this.gameTime() + respawnPeriod])
        }))
    }

    enqueueDespawn(actor, locationId, count = 1) {
        this.setState('despawn_queue', produce(queue => {
            queue.push([actor.id, count, locationId, this.gameTime() + DESPAWN_PERIOD])
        }))
    }

    tryRespawn() {
        const current = this.gameTime()
        let respawned = []
        this.state.spawn_queue.forEach(([src, count, locId, time], idx) => {
            if (time > current) return
            respawned.push(idx)
            if (typeof src == 'string' && src[0] == 'n') {
                this.createNpc(src, locId)
            }
            else {
                this.get(locId).add(this.get(src), count)
            }
        })

        if (respawned.length > 0) {
            this.setState('spawn_queue', produce(queue => {
                for (const i of respawned) {
                    queue[i] = queue[queue.length - 1]
                    queue.length -= 1
                }
            }))
        }
    }

    tryDespawn() {
        const current = this.gameTime()
        let despawned = []
        this.state.despawn_queue.forEach(([id, count, locId, time], idx) => {
            if (time > current) return
            despawned.push(idx)
            const actor = this.get(id)
            if (!actor) return
            this.get(locId).remove(actor, count)
            if (!!actor.state.custom) {
                this.remove(actor)
            }
        })

        if (despawned.length > 0) {
            this.setState('despawn_queue', produce(queue => {
                for (const i of despawned) {
                    queue[i] = queue[queue.length - 1]
                    queue.length -= 1
                }
            }))
        }
    }

    createCorpse(actor) {
        const location = actor.location()
        const id = this.nextId()
        const corpseSrc = 'i.d.corpse'

        this.setState(produce(state => {
            let corpse = deepCopy(ItemDefinitions[corpseSrc])
            corpse.src = corpseSrc
            corpse.name = actor.name() + ' (corpse)'
            corpse.location = location.id
            corpse.custom = true
            state[id] = corpse
        }))

        const corpse = this.get(id)
        actor.moveItemsToCorpse(corpse)
        location.add(corpse)

        // Corpse should eventually disappear
        this.enqueueDespawn(corpse, location.id)

        return corpse
    }

    createNpc(src, locId) {
        const location = this.get(locId)
        const id = this.nextId() 

        this.setState(produce(state => {
            state[id] = deepCopy(NpcDefinitions[src])
            state[id].src = src
            state[id].location = location.id
            state[id].spawn_point = location.id
        }))

        const npc = this.get(id)
        location.add(npc)
    }

    updateAITime(timer, time) {
        this.setState('ai', produce(ai => ai[timer] = time))
    }
}

export { GameEngine }