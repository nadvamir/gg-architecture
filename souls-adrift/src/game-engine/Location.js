class Location {
    constructor(id, state, gameEngine) {
        this.id = id
        this.state = state
        this.gameEngine = gameEngine
    }

    name() {
        return this.state.name
    }

    description() {
        return this.state.desc
    }

    moves(player) {
        let baseMoves = this.state.moves.map(m => [this.gameEngine.get(m), true])
        let gated = this.state.gated_moves || {}
        for (const id of Object.keys(gated)) {
            baseMoves.push([this.gameEngine.get(id), player.hasItem(gated[id])])
        }
        return baseMoves
    }

    noisy() {
        return this.actors().filter(a => a.constructor.name != 'Item').length > 0
    }

    actors() {
        return this.state.actors.map(a => this.gameEngine.get(a)).sort((l, r) => { return l.id - r.id })
    }
}

export { Location }