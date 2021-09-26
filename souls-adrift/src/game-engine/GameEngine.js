import { createStore, produce } from 'solid-js/store';

import { MessageType } from '../gossip-graph/MessageType.js'
import { Player } from './Player.js'
import { Npc } from './Npc.js'
import { Item } from './Item.js'
import { Location } from './Location.js'

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

    send(message) {
        this.setInteractionState({ sending: true })
        console.log('Sending!')
        this.nextHash = this.gossipGraph.send(MessageType.DIRECT_MESSAGE, message)
    }

    onMessageReceived(sender, type, message, hash) {
        const res = sender + ': ' + message + ' (' + hash + ')'
        this.setState('messages', produce(messages => {
            messages.push([new Date(), res])
        }))
        if (hash == this.nextHash) {
            console.log('Received')
            this.setInteractionState({ sending: false })
        }
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
            3000001: {
                'name': '__Blind_Augur__',
                'type': 'player',
                'stats': {
                    'hp': 10,
                    'lvl': 1,
                    'exp': 15,
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
                'type': 'player',
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
                'type': 'npc.talk',
                'stats': {
                    'hp': 40,
                    'lvl': 5,
                    'exp_worth': 30,
                    'base_dmg': 2,
                    'base_armor': 0
                },
                'skills': {
                    'strength': 5,
                    'constitution': 4,
                    'dexterity': 2,
                    'sabre': 0
                },
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
                'battle': 0
            },
            1000002: {
                'name': 'Rat',
                'type': 'npc.aggro',
                'stats': {
                    'hp': 10,
                    'lvl': 1,
                    'exp_worth': 10,
                    'base_dmg': 2,
                    'base_armor': 0
                },
                'skills': {
                    'strength': 1,
                    'constitution': 2,
                    'dexterity': 1,
                    'sabre': 0
                },
                // list of equipped ids
                'equipment': [],
                // id -> count
                'inventory': {},
                'location': 1,
                'battle': 3000002
            },
            1000003: {
                'name': 'Mouse',
                'type': 'npc.chill',
                'stats': {
                    'hp': 7,
                    'lvl': 1,
                    'exp_worth': 10,
                    'base_dmg': 2,
                    'base_armor': 0
                },
                'skills': {
                    'strength': 1,
                    'constitution': 1,
                    'dexterity': 1,
                    'sabre': 0
                },
                // list of equipped ids
                'equipment': [],
                // id -> count
                'inventory': {},
                'location': 1,
                'battle': 3000001
            },
            1000004: {
                'name': 'Rat',
                'type': 'npc.aggro',
                'stats': {
                    'hp': 10,
                    'lvl': 1,
                    'exp_worth': 10,
                    'base_dmg': 2,
                    'base_armor': 0
                },
                'skills': {
                    'strength': 1,
                    'constitution': 1,
                    'dexterity': 1,
                    'sabre': 0
                },
                // list of equipped ids
                'equipment': [],
                // id -> count
                'inventory': {},
                'location': 1,
                'battle': 0
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
                'name': 'Forlorn Quay',
                'desc': 'The wind blows freely over the empty quay. Rotten fishing nets lie here and there.',
                'moves': [2, 3, 4],
                'gated_moves': {
                    // id -> required item
                    5: 2000007
                },
                'actors': [3000001, 3000002, 2000003, 1000001, 1000002, 1000003, 1000004]
            },
            2: {
                'name': 'Main Street',
                'desc': 'Nothing special.',
                'moves': [1],
                'actors': [3000001]
            },
            3: {
                'name': 'Near Sunken Boat',
                'desc': 'The boat is still visible on the bottom of the sea.',
                'moves': [1],
                'actors': [2000007]
            },
            4: {
                'name': 'Fourth Wall Libarary',
                'desc': 'This is where to find all the game info.',
                'moves': [1],
                'actors': []
            },
            5: {
                'name': 'Old house',
                'desc': 'The ceiling is about to fall.',
                'moves': [1],
                'actors': [1000001]
            }
        })

        this.recoverHealth()
    }

    recoverHealth() {
        const player = this.get(this.state.uid)
        if (player.hp() < player.maxHp()) {
            this.setState(this.state.uid, produce(player => {
                player.stats.hp += 1
            }))
            setTimeout(_ => this.recoverHealth(), 1000)
        }
    }

    // ----------------- Accessors -----------------
    get(id) {
        if (typeof id == 'string') id = parseInt(id, 10)
        if (id < 1000000) return new Location(id, this.state[id], this)
        else if (id < 2000000) return new Npc(id, this.state[id], this)
        else if (id < 3000000) return new Item(id, this.state[id], this)
        else return new Player(id, this.state[id], this)
    }

    moneyId() {
        return 2000005
    }
}

export { GameEngine }