// Despawn is always run since game potentially has different spawn times for different items
class Despawn {
    constructor(ai, gameEngine) {
        this.ai = ai
        this.gameEngine = gameEngine
    }

    run(time) {
        this.gameEngine.tryDespawn()
    }
}

export { Despawn }