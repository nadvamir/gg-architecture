import { ActorMixin } from "./ActorMixin"

class Npc {
    constructor(id, state, gameEngine) {
        this.id = id
        this.state = state
        this.gameEngine = gameEngine
    }

    type() {
        return this.state.type
    }
}

Object.assign(Npc.prototype, ActorMixin)

export { Npc }