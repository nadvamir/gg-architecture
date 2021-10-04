import { processAttack } from "../actions/Attack"
import { Reflection } from "../util/Reflection"

const ATTACK_PERIOD = 10 * 1000

// if at least ATTACK PERIOD has passed, NPCs in a fight attack
class NpcAttack {
    constructor(ai, gameEngine) {
        this.ai = ai
        this.gameEngine = gameEngine
    }

    run(aliveActors, time) {
        // potentially introducing new, registering the timer
        const timer = 'npc_attack'
        const lastTime = this.gameEngine.getAITime(timer)
        if (!lastTime) {
            this.gameEngine.updateAITime(timer, time)
            return
        }

        if (time - lastTime < ATTACK_PERIOD) {
            return
        }

        this.gameEngine.updateAITime(timer, time)

        aliveActors().forEach(a => {
            if (!Reflection.isNpc(a) || !a.isBattling()) return
            processAttack([a.id, a.battleTarget().id], this.gameEngine)
        })
    }
}

export { NpcAttack }