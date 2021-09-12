import { createStore } from 'solid-js/store'

class InfoModalController {
    constructor() {
        const [state, setState] = createStore({
            open: false,
            item: {}
        })
        this.state = state
        this.setState = setState
    }

    showInfo(type, id) {
        this.setState({
            open: true,
            item: {type: type, id: id}
        })
    }

    hide() {
        this.setState({open: false})
    }
}

const infoModalController = new InfoModalController()

export { infoModalController }