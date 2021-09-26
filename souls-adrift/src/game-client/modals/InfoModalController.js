import { createStore } from 'solid-js/store'

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

    hide() {
        this.setState({open: false})
    }
}

const infoModalController = new InfoModalController()

export { infoModalController }