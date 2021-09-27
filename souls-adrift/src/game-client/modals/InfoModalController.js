import { createStore } from 'solid-js/store'

class CountSelector {
    constructor(callback, item, max, text) {
        this.callback = callback
        this.item = item
        this.max = max
        this.text = text
    }
}

class InfoModalController {
    constructor() {
        const [state, setState] = createStore({
            open: false,
            actor: {}
        })
        this.state = state
        this.setState = setState
    }

    showInfo(actor) {
        this.setState({
            open: true,
            actor: actor
        })
    }

    showCountSelector(callback, item, max, text) {
        this.setState({
            open: true,
            actor: new CountSelector(callback, item, max, text)
        })
    }

    hide() {
        this.setState({open: false})
    }
}

const infoModalController = new InfoModalController()

export { infoModalController }