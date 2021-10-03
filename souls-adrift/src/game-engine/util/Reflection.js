class Reflection {
    static isPlayer(actor) {
        return !!actor && actor.constructor.name == "Player"
    }

    static isNpc(actor) {
        return !!actor && actor.constructor.name == "Npc"
    }

    static isLocation(actor) {
        return !!actor && actor.constructor.name == "Location"
    }

    static isLocation(actor) {
        return !!actor && actor.constructor.name == "Location"
    }
}

export { Reflection }