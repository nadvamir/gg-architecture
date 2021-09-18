class Player {
    constructor(state) {
        this.state = state
    }

    hp() {
        return this.state.stats.hp
    }
}

export { Player }