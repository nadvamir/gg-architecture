// Respawn is always run since game potentially has different spawn times for different items
class Respawn {
    constructor(ai, gameEngine) {
        this.ai = ai
        this.gameEngine = gameEngine
    }

    run(time) {
        this.gameEngine.tryRespawn()
    }
}

export { Respawn }