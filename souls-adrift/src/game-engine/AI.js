import { HealthRegen } from './ai/HealthRegen'
import { NpcRoam } from './ai/NpcRoam';
import { TraderRestock } from './ai/TraderRestock';

function lazy(dataFunc) {
    let data;
    return () => {
        if (!data) data = dataFunc()
        return data
    }
}

class AI {
    constructor(gameEngine) {
        this.gameEngine = gameEngine
        this.lastTime = 0

        // AI actions on alive objects
        this.aliveActorActions = [
            new HealthRegen(this, gameEngine),
            new NpcRoam(this, gameEngine),
            new TraderRestock(this, gameEngine),
        ]
    }

    run(time) {
        const aliveActors = lazy(() => this.gameEngine.aliveActors())

        this.aliveActorActions.forEach(a => a.run(aliveActors, time))
    }
}

export { AI }