import { MessageType } from '../gossip-graph/MessageType.js'

import { createStore } from 'solid-js/store';

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

        setTimeout(_ => this.loadGameState(), 1000)
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
            uid: 2000001,
            players: {
                2000001: {
                    'name': '__Blind_Augur__',
                    'stats': {
                        'hp': 10,
                        'lvl': 1,
                        'exp': 15,
                        'skill_points': 1
                    },
                    'skills': {
                        'strength': 3,
                        'constitution': 2,
                        'dexterity': 2,
                        'sabre': 1
                    },
                    // list of equipped ids
                    'equipment': [1000001, 1000002],
                    // id -> count
                    'inventory': {
                        1000001: 1,
                        1000002: 1,
                        1000003: 1,
                        1000004: 2,
                        1000005: 25
                    },
                    'quest': {
                        1: 1,
                        2: 4
                    },
                    'location': 1,
                    // player or npc id
                    'battle': 3
                },
                2000002: {
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
                    'equipment': [1000002, 1000006],
                    // id -> count
                    'inventory': {
                        1000002: 1,
                        1000006: 1
                    },
                    'quest': {
                        1: 2
                    },
                    'location': 1,
                    // id of person or npc
                    'battle': 2
                }
            },
            npcs: {
                1: {
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
                    'equipment': [1000001, 1000002],
                    // id -> count
                    'inventory': {
                        1000001: 1,
                        1000002: 1,
                        1000006: 3
                    },
                    'trade': {
                        // what's he willing to sell, ids
                        'for_sale': [1000006],
                        'buy': 0.8,
                        'sell': 1.2,
                        // classes of items he's interested in
                        'to_buy': ['weapon', 'helmet', 'gloves', 'boots']
                    },
                    'location': 1,
                    'battle': 0
                },
                2: {
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
                    'battle': 2000002
                },
                3: {
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
                    'battle': 2000001
                },
                4: {
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
                }
            },
            items: {
                1000001: {
                    'name': 'Officer Sabre',
                    'value': 20,
                    'type': 'weapon',
                    'mid_dmg': 4,
                    'max_dmg': 7,
                    'skills': {
                        'dex': 1,
                        'sabre': 1
                    }
                },
                1000002: {
                    'name': 'Leather gloves',
                    'value': 10,
                    'type': 'gloves',
                    'armor': 1
                },
                1000003: {
                    'name': 'Rusty shank',
                    'value': 5,
                    'type': 'weapon',
                    'mid_dmg': 0,
                    'max_dmg': 3
                },
                1000004: {
                    'name': 'Health potion',
                    'value': 10,
                    'type': 'consumable',
                    'health': 10
                },
                1000005: {
                    'name': 'Coin',
                    'value': 1,
                    'type': 'misc'
                },
                1000006: {
                    'name': 'Leather boots',
                    'value': 15,
                    'type': 'boots',
                    'armor': 2
                },
                1000007: {
                    'name': 'Rusty key',
                    'value': 0,
                    'type': 'misc'
                }
            },
            locations: {
                1: {
                    'name': 'Forlorn Quay',
                    'desc': 'The wind blows freely over the empty quay. Rotten fishing nets lie here and there.',
                    'moves': [2, 3, 4],
                    'gated_moves': {
                        // id -> required item
                        5: 1000007
                    },
                    'actors': [2000001, 2000002, 1000003, 1, 2, 3, 4]
                }
            }
        })

        this.recoverHealth()
    }

    recoverHealth() {
        if (this.state.players[this.state.uid].stats.hp < 20) {
            let newState = {'players': {}}
            newState.players[this.state.uid] = {
                'stats': {'hp': this.state?.players[this.state.uid].stats.hp + 1}
            }
            this.setState(newState)
            setTimeout(_ => this.recoverHealth(), 1000)
        }
    }
}

export { GameEngine }