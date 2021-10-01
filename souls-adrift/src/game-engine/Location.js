import { produce } from 'solid-js/store';

import { LocationDefinitions } from './data/LocationDefinitions.js'

class Location {
    constructor(id, state, gameEngine) {
        this.id = id
        this.state = state
        this.gameEngine = gameEngine
        this.src = LocationDefinitions[this.state.src]
    }

    get(field) {
        if (field in this.state) return this.state[field]
        return this.src[field]
    }

    name() {
        return this.get('name')
    }

    description() {
        return this.get('desc')
    }

    moves(player) {
        let baseMoves = this.get('moves').map(m => [this.gameEngine.get(m), true])
        let gated = this.get('gated_moves') || {}
        for (const id of Object.keys(gated)) {
            baseMoves.push([this.gameEngine.get(id), player.hasItem(gated[id])])
        }
        return baseMoves
    }

    noisy() {
        return this.actors().filter(a => a[0].constructor.name != 'Item').length > 0
    }

    actors() {
        const actors = this.get('actors')
        const actorList = []
        for (const sid of Object.keys(actors)) {
            const id = parseInt(sid, 10)
            actorList.push([this.gameEngine.get(id), actors[id]])
        }
        return actorList.sort((l, r) => { return l[0].id - r[0].id })
    }

    hasActor(actor, count = 1) {
        const numInLoc = this.get('actors')[actor.id] || 0
        return count <= numInLoc
    }

    actorsFighting(actor) {
        return this.actors()
            .filter(([a, _]) => !!a.isBattling && a.isBattling(actor.id))
            .map(([a, _]) => a)
    }

    // ------------- Checks ---------------
    isReachableFrom(source, actor) {
        return !!source.moves(actor).find(([l, reachable]) => {
            return reachable && l.id == this.id
        })
    }

    // ------------ Modifiers -------------
    // Do no checks, must be valid operations
    add(actor, count = 1) {
        if (count < 1) return
        this.gameEngine.setState(this.id, produce(loc => {
            loc.actors[actor.id] = count + (loc.actors[actor.id] || 0)
        }))
    }

    remove(actor, count = 1) {
        if (count < 1) return
        this.gameEngine.setState(this.id, produce(loc => {
            if (loc.actors[actor.id] <= count) {
                delete loc.actors[actor.id]
            }
            else {
                loc.actors[actor.id] -= count
            }
        }))
    }
}

export { Location }