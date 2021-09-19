class Player {
    constructor(state) {
        this.state = state
    }

    hp() {
        return this.state.stats.hp
    }

    maxHp() {
        return this.state.skills.constitution * 10
    }
}

export { Player }