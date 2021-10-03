import { processGoTo } from "../actions/GoTo"
import { Reflection } from "../util/Reflection"

const ROAM_PERIOD = 1 * 1000
const ROAM_CHANCE = 50

// if at least ROAM PERIOD has passed, move npcs around
// but don't leave the main area
class NpcRoam {
    constructor(ai, gameEngine) {
        this.ai = ai
        this.gameEngine = gameEngine
        this.lastTime = 0
    }

    run(aliveActors, time) {
        // potentially introducing new, registering the timer
        const timer = 'npc_roam'
        const lastTime = this.gameEngine.getAITime(timer)
        if (!lastTime) {
            this.gameEngine.updateAITime(timer, time)
            return
        }

        if (time - lastTime < ROAM_PERIOD) {
            return
        }

        this.gameEngine.updateAITime(timer, time)

        aliveActors().forEach(a => {
            if (!Reflection.isNpc(a) || !a.canRoam()) return
            if (a.battleTarget()) return
            if (this.gameEngine.rand() > ROAM_CHANCE) return

            // select a location within the area
            const current = a.location()
            const currentRegion = current.region()
            const moves = current.moves(a).filter(([l, reachable]) => {
                return reachable && l.region() == currentRegion
            })
            if (moves.length == 0) return
            const target = moves[this.gameEngine.rand() % moves.length]

            processGoTo([a.id, target[0].id], this.gameEngine)
        })
    }
}

export { NpcRoam }