import { createStore, produce } from 'solid-js/store';

import { MessageType } from '../gossip-graph/MessageType.js'
import { serialise, deserialise } from './MessageSerialiser.js'
import { Player } from './Player.js'
import { Npc } from './Npc.js'
import { Item } from './Item.js'
import { Location } from './Location.js'
import { Action } from "./actions/ActionFactory";
import { deepCopy } from '../game-client/util/Util.js';
import { ItemDefinitions } from './data/ItemDefinitions.js';

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

        const [interactionState, setInteractionState] = createStore({
            sending: false
        })
        this.interactionState = interactionState
        this.setInteractionState = setInteractionState

        // Used to serialise UI commands
        this.nextHash = null

        setTimeout(_ => this.loadGameState(), 300)
    }

    send(action, args) {
        const message = serialise(action, args)
        this.setInteractionState({ sending: true })
        console.log('Sending!')
        this.nextHash = this.gossipGraph.send(MessageType.DIRECT_MESSAGE, message)
    }

    sendToLoc(location, action, args) {
        //TODO: send direct messages to everyone in the graph
        this.send(action, args)
    }

    onMessageReceived(sender, type, message, hash) {
        const [action, args] = deserialise(message)
        if (!this.authorised(sender, type, action, args)) {
            console.log('Received an unauthorised message')
            return
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

    loadGameState() {
        this.setState({
            uid: 3000001,
            spawn_queue: [],
            region_spawn_point: 1,
            last_id: 3000002,
            3000001: {
                'name': '__Blind_Augur__',
                'src': 'p.player',
                'stats': {
                    'hp': 10,
                    'lvl': 1,
                    'exp': 85,
                    'skill_points': 1
                },
                'skills': {
                    'strength': 3,
                    'constitution': 3,
                    'dexterity': 2,
                    'sabre': 0
                },
                // list of equipped ids
                'equipment': [2000001, 2000002],
                // id -> count
                'inventory': {
                    2000001: 1,
                    2000002: 1,
                    2000003: 1,
                    2000004: 2,
                    2000005: 25
                },
                'quest': {
                    1: 1,
                    2: 4
                },
                'location': 1,
                // player or npc id
                'battle': 1000003
            },
            3000002: {
                'name': 'L33t Hax0r',
                'src': 'p.player',
                'stats': {
                    'hp': 18,
                    'lvl': 1,
                    'exp': 20,
                    'skill_points': 0
                },
                'skills': {
                    'strength': 3,
                    'constitution': 2,
                    'dexterity': 3,
                    'sabre': 0
                },
                // list of equipped ids
                'equipment': [2000002, 2000006],
                // id -> count
                'inventory': {
                    2000002: 1,
                    2000006: 1
                },
                'quest': {
                    1: 2
                },
                'location': 1,
                // id of person or npc
                'battle': 1000002
            },
            1000001: {
                'name': 'Sailor Jerry',
                'src': 'n.t.sailor.jerry',
                // list of equipped ids
                'equipment': [2000001, 2000002],
                // id -> count
                'inventory': {
                    2000001: 1,
                    2000002: 1,
                    2000005: 100,
                    2000006: 3
                },
                'trade': {
                    // what's he willing to sell, ids
                    'for_sale': [2000006],
                    'buy': 0.8,
                    'sell': 1.2,
                    // classes of items he's interested in
                    'to_buy': ['weapon', 'helmet', 'gloves', 'boots']
                },
                'location': 1,
                'spawn_point': 1
            },
            1000002: {
                'name': 'Rat',
                'src': 'n.x.rat',
                'location': 1,
                'spawn_point': 2,
                'battle': 3000002
            },
            1000003: {
                'name': 'Mouse',
                'src': 'n.a.mouse',
                'location': 1,
                'spawn_point': 1,
                'battle': 3000001
            },
            1000004: {
                'name': 'Rat',
                'src': 'n.x.rat',
                'stats': {
                    'hp': 20,
                    'lvl': 1,
                    'exp_worth': 10,
                    'base_dmg': 2,
                    'dmg_spread': 3,
                    'base_armor': 0
                },
                'location': 1,
                'spawn_point': 3
            },
            2000001: {
                'src': 'i.w.sabre.officer',
                'value': 25
            },
            2000002: {
                'src': 'i.a.gloves.leather'
            },
            2000003: {
                'src': 'i.w.shank.rusty'
            },
            2000004: {
                'src': 'i.c.potion.health.10'
            },
            2000005: {
                'src': 'i.m.coin'
            },
            2000006: {
                'src': 'i.a.boots.leather'
            },
            2000007: {
                'src': 'i.m.key.rusty'
            },
            1: {
                'src': 'l.town.forlorn.quay',
                'actors': { 3000001: 1, 3000002: 1, 2000003: 1, 1000001: 1, 1000002: 1, 1000003: 1, 2000005: 5 }
            },
            2: {
                'src': 'l.town.main.street',
                'actors': {1000004: 1}
            },
            3: {
                'src': 'l.town.near.sunken.boat',
                'actors': { 2000007: 1 }
            },
            4: {
                'src': 'l.town.fourth.wall.library',
                'actors': {}
            },
            5: {
                'src': 'l.town.old.house',
                'actors': {}
            }
        })

        this.recoverHealth()
    }

    recoverHealth() {
        const player = this.player()
        if (player.hp() < player.maxHp()) {
            player.alterHealth(1)
            setTimeout(_ => this.recoverHealth(), 1000)
        }
    }

    // ------------ Synchronised random ------------
    rand() {
        //TODO: create a custom calculator seeded by event hash
        return Math.round(Math.random() * 100)
    }

    // ----------------- Accessors -----------------
    get(id) {
        const entity = this.state[id]
        switch (entity.src[0]) {
            case 'l': return new Location(id, entity, this)
            case 'n': return new Npc(id, entity, this)
            case 'i': return new Item(id, entity, this)
            case 'p': return new Player(id, entity, this)
        }
        console.log('Couldnt find game entity', id)
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

    // ------------ Event Handling -----------------
    // check the author had a right to submit this event
    authorised(sender, type, action, args) {
        if (sender == this.serverId()) return true
        if (action == Action.OverwriteState) return false
        return sender == args[0]
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
        this.setState(produce(state => {
            delete state[actor.id]
        }))
    }

    enqueueRespawn(src, locationId) {
        this.setState('spawn_queue', produce(queue => {
            queue.push([src, locationId])
        }))
    }

    createCorpse(actor) {
        const location = actor.location()
        const id = this.nextId()
        const corpseSrc = 'i.d.corpse'

        this.setState(produce(state => {
            state[id] = deepCopy(ItemDefinitions[corpseSrc])
            state[id].src = corpseSrc
            state[id].name = actor.name() + ' (corpse)'
            state[id].location = location.id
        }))

        const corpse = this.get(id)
        actor.moveItemsToCorpse(corpse)
        location.add(corpse)

        return corpse
    }
}

export { GameEngine }