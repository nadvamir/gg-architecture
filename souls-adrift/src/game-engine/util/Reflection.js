class Reflection {
    static isPlayer(actor) {
        return !!actor && actor.constructor.name == "Player"
    }

    static isNpc(actor) {
        return !!actor && actor.constructor.name == "Npc"
    }

    static isItem(actor) {
        return !!actor && actor.constructor.name == "Item"
    }

    static isLocation(actor) {
        return !!actor && actor.constructor.name == "Location"
    }
    static isAlive(actor) {
        return this.isPlayer(actor) || this.isNpc(actor)
    }
}

export { Reflection }