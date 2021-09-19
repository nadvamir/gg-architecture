import { createStore, produce } from 'solid-js/store';

import { MessageType } from '../gossip-graph/MessageType.js'
import { Player } from './Player.js'

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
        const messages = this.state.messages.slice()
        messages.push(res)
        this.setState({ messages: messages })
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
                    'sabre': 1
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
                'name': 'Officer Sabre',
                'value': 20,
                'type': 'weapon',
                'mid_dmg': 4,
                'max_dmg': 7,
                'skills': {
                    'dexterity': 1,
                    'sabre': 1
                }
            },
            2000002: {
                'name': 'Leather gloves',
                'value': 10,
                'type': 'gloves',
                'armor': 1
            },
            2000003: {
                'name': 'Rusty shank',
                'value': 5,
                'type': 'weapon',
                'mid_dmg': 0,
                'max_dmg': 3
            },
            2000004: {
                'name': 'Health potion',
                'value': 10,
                'type': 'consumable',
                'health': 10
            },
            2000005: {
                'name': 'Coin',
                'value': 1,
                'type': 'misc'
            },
            2000006: {
                'name': 'Leather boots',
                'value': 15,
                'type': 'boots',
                'armor': 2
            },
            2000007: {
                'name': 'Rusty key',
                'value': 0,
                'type': 'misc'
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
            }
        })

        this.recoverHealth()
    }

    recoverHealth() {
        const player = new Player(this.state[this.state.uid])
        if (player.hp() < player.maxHp()) {
            this.setState(this.state.uid, produce(player => {
                player.stats.hp += 1
            }))
            setTimeout(_ => this.recoverHealth(), 1000)
        }
    }

    // ----------------- Accessors -----------------
    get(id) {
        if (id < 1000000) return {} // location
        else if (id < 2000000) return {} // npc
        else if (id < 3000000) return {} // item
        else return new Player(this.state[id], this)
    }
}

export { GameEngine }