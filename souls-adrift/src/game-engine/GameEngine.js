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
        this.setState({messages: messages})
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
}

export { GameEngine }