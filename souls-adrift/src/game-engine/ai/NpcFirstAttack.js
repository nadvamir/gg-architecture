import { processAttack } from "../actions/Attack"
import { Reflection } from "../util/Reflection"

const FIRST_ATTACK_PERIOD = 1 * 1000

// hostile NPCs will attack immediately if not in the battle already
// but having a debouncing timer for performance
class NpcFirstAttack {
    constructor(ai, gameEngine) {
        this.ai = ai
        this.gameEngine = gameEngine
    }

    run(aliveActors, time) {
        // potentially introducing new, registering the timer
        const timer = 'npc_first_attack'
        const lastTime = this.gameEngine.getAITime(timer)
        if (!lastTime) {
            this.gameEngine.updateAITime(timer, time)
            return
        }

        if (time - lastTime < FIRST_ATTACK_PERIOD) {
            return
        }

        this.gameEngine.updateAITime(timer, time)

        aliveActors().forEach(a => {
            if (!Reflection.isNpc(a) || a.isBattling() || a.category() != 'x') return
            // pick a random player target
            const players = a.location().actors().filter(([p, _]) => Reflection.isPlayer(p))
            if (players.length == 0) return
            const target = players[this.gameEngine.rand() % players.length]
            processAttack([a.id, target[0].id], this.gameEngine)
        })
    }
}

export { NpcFirstAttack }