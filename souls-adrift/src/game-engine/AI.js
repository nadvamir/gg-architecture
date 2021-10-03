import { HealthRegen } from './ai/HealthRegen'

class AI {
    constructor(gameEngine) {
        this.gameEngine = gameEngine
        this.lastTime = 0

        // AI actions on alive objects
        this.aliveActorActions = [
            new HealthRegen(this, gameEngine)
        ]
    }

    run(time) {
        const aliveActors = this.gameEngine.aliveActors()

        this.aliveActorActions.forEach(a => a.run(aliveActors, time))
    }
}

export { AI }