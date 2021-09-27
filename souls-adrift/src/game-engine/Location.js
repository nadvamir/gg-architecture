import { LocationDefinitions } from './data/LocationDefinitions.js'

class Location {
    constructor(id, state, gameEngine) {
        this.id = id
        this.state = state
        this.gameEngine = gameEngine
        this.src = LocationDefinitions[this.state.src]
    }

    get(field) {
        if (field in this.state) return this.state[field]
        return this.src[field]
    }

    name() {
        return this.get('name')
    }

    description() {
        return this.get('desc')
    }

    moves(player) {
        let baseMoves = this.get('moves').map(m => [this.gameEngine.get(m), true])
        let gated = this.get('gated_moves') || {}
        for (const id of Object.keys(gated)) {
            baseMoves.push([this.gameEngine.get(id), player.hasItem(gated[id])])
        }
        return baseMoves
    }

    noisy() {
        return this.actors().filter(a => a[0].constructor.name != 'Item').length > 0
    }

    actors() {
        const actors = this.get('actors')
        const actorList = []
        for (const sid of Object.keys(actors)) {
            const id = parseInt(sid, 10)
            actorList.push([this.gameEngine.get(id), actors[id]])
        }
        return actorList.sort((l, r) => { return l[0].id - r[0].id })
    }
}

export { Location }