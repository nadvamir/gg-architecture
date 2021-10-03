import { Reflection } from "../util/Reflection"

const RESTOCK_PERIOD = 20 * 1000

// if at least RESTOCK PERIOD has passed, reset inventories
class TraderRestock {
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

        if (time - this.lastTime < RESTOCK_PERIOD) {
            return
        }

        this.lastTime = time

        aliveActors().forEach(a => {
            if (!Reflection.isNpc(a) || !a.isTrader()) return

            // reset inventory to match the source
            a.resetInventory()
        })
    }
}

export { TraderRestock }