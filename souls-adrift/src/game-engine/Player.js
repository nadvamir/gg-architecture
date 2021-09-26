import { ActorMixin } from "./ActorMixin"
import { PlayerDefinitions } from "./data/PlayerDefinitions"

class Player {
    constructor(id, state, gameEngine) {
        this.id = id
        this.state = state
        this.gameEngine = gameEngine
        this.src = PlayerDefinitions[this.state.src]
    }

    get(field) {
        if (field in this.state) return this.state[field]
        return this.src[field]
    }

    description() {
        return 'A fellow stranded soul.'
    }

    exp() {
        const stats = this.get('stats')
        return stats.exp
    }

    maxExp() {
        const stats = this.get('stats')
        return Math.round(100 * Math.pow(2, stats.lvl - 1))
    }

    skillPoints() {
        const stats = this.get('stats')
        return stats.skill_points
    }

    level() {
        const stats = this.get('stats')
        return stats.lvl
    }
}

Object.assign(Player.prototype, ActorMixin)

export { Player }