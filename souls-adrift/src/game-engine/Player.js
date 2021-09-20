import { ActorMixin } from "./ActorMixin"

class Player {
    constructor(id, state, gameEngine) {
        this.id = id
        this.state = state
        this.gameEngine = gameEngine
    }

    exp() {
        return this.state.stats.exp
    }

    maxExp() {
        return Math.round(100 * Math.pow(2, this.state.stats.lvl - 1))
    }

    skillPoints() {
        return this.state.stats.skill_points
    }

    level() {
        return this.state.stats.lvl
    }
}

Object.assign(Player.prototype, ActorMixin)

export { Player }