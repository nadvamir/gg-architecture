const REGEN_PERIOD = 1 * 1000

// Restore 1 health to everyone on a fixed timer
class HealthRegen {
    constructor(ai, gameEngine) {
        this.ai = ai
        this.gameEngine = gameEngine
        this.lastTime = 0
    }

    run(aliveActors, time) {
        // first message sets state -> we are up-to-date
        if (this.lastTime == 0) {
            this.lastTime = time
            return
        }

        if (time - this.lastTime < REGEN_PERIOD) {
            return
        }

        this.lastTime = time

        aliveActors.forEach(a => {
            if (a.hp() < a.maxHp()) {
                a.alterHealth(1)
            }
        })
    }
}

export { HealthRegen }