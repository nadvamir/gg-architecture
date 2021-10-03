const REGEN_PERIOD = 1 * 1000

// Restore 1 health to everyone on a fixed timer
class HealthRegen {
    constructor(ai, gameEngine) {
        this.ai = ai
        this.gameEngine = gameEngine
    }

    run(aliveActors, time) {
        // potentially introducing new, registering the timer
        const timer = 'health_regen'
        const lastTime = this.gameEngine.getAITime(timer)
        if (!lastTime) {
            this.gameEngine.updateAITime(timer, time)
            return
        }

        if (time - lastTime < REGEN_PERIOD) {
            return
        }

        this.gameEngine.updateAITime(timer, time)

        aliveActors().forEach(a => {
            if (a.hp() < a.maxHp()) {
                a.alterHealth(Math.round((time - lastTime) / REGEN_PERIOD))
            }
        })
    }
}

export { HealthRegen }