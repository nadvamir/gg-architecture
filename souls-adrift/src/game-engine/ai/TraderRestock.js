import { Reflection } from "../util/Reflection"

const RESTOCK_PERIOD = 20 * 60 * 1000

// if at least RESTOCK PERIOD has passed, reset inventories
class TraderRestock {
    constructor(ai, gameEngine) {
        this.ai = ai
        this.gameEngine = gameEngine
        this.lastTime = 0
    }

    run(aliveActors, time) {
        // potentially introducing new, registering the timer
        const timer = 'trader_restock'
        const lastTime = this.gameEngine.getAITime(timer)
        if (!lastTime) {
            this.gameEngine.updateAITime(timer, time)
            return
        }

        if (time - lastTime < RESTOCK_PERIOD) {
            return
        }

        this.gameEngine.updateAITime(timer, time)

        aliveActors().forEach(a => {
            if (!Reflection.isNpc(a) || !a.isTrader()) return

            // reset inventory to match the source
            a.resetInventory()
        })
    }
}

export { TraderRestock }