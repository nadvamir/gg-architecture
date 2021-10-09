import { produce } from 'solid-js/store';

import { ActorMixin } from "./ActorMixin"
import { PlayerDefinitions } from "./data/PlayerDefinitions"

const LEVEL_EXPONENT = 1.5
const BASE_LEVEL_POINTS = 100

class Player {
    constructor(id, state, gameEngine) {
        this.id = id
        this.state = state
        this.gameEngine = gameEngine
        this.src = PlayerDefinitions[this.state.src]
    }

    get(field) {
        if (field in this.state) return this.state[field]
        return this.src[field]
    }

    category() {
        return this.state.src[2]
    }

    description() {
        return 'A fellow stranded soul.'
    }

    exp() {
        const stats = this.get('stats')
        return stats.exp
    }

    maxExp() {
        const stats = this.get('stats')
        return Math.round(BASE_LEVEL_POINTS * Math.pow(LEVEL_EXPONENT, stats.lvl - 1))
    }

    skillPoints() {
        const stats = this.get('stats')
        return stats.skill_points
    }

    spawnPoint() {
        const loc = this.get('spawn_point') && this.gameEngine.get(this.get('spawn_point'))
        return loc || this.gameEngine.regionSpawnPoint()
    }

    // --------- Probabilities ------
    chaseChance() {
        return 0
    }

    // ---------- Modifiers ----------
    gainExperience(victim) {
        // at each level we want to level-up by wining 10*level fair fights
        const expByLevel = Math.round(BASE_LEVEL_POINTS * Math.pow(LEVEL_EXPONENT, victim.level() - 1) / 10 / victim.level())
        const expGain = victim.get('stats').exp_worth || expByLevel
        const nextLevelAt = this.maxExp()

        let levelledUp = false

        this.gameEngine.setState(this.id, produce(actor => {
            this.ensure(actor, 'stats')
            actor.stats.exp += expGain
            if (actor.stats.exp > nextLevelAt) {
                actor.stats.exp -= nextLevelAt
                actor.stats.lvl += 1
                actor.stats.skill_points += 1
                levelledUp = true
            }
        }))

        if (this.gameEngine.playerId() == this.id) {
            this.gameEngine.recordEvent('Exp +' + expGain)
            if (levelledUp) {
                this.gameEngine.recordEvent('You have gained 1 skill point!')
            }
        }
    }

    die() {
        const location = this.location()

        if (this.gameEngine.player().location().id == location.id) {
            if (this.gameEngine.playerId() == this.id) {
                this.gameEngine.recordEvent('You have died!')
                this.gameEngine.recordEvent('Your surroundings have changed.')
            }
            else {
                this.gameEngine.recordEvent(this.name() + ' has died!')
            }
        }

        location.remove(this)
        location.actorsFighting(this).forEach(a => a.setBattle(0))
        this.setBattle(0)
        this.gameEngine.createCorpse(this)

        const spawnPoint = this.spawnPoint()
        spawnPoint.add(this)
        this.setLocation(spawnPoint)
        this.alterHealth(1)
    }

    moveItemsToCorpse(corpse) {
        // For the player, all invetory items that are not equipped
        const excludeEquipped = true
        this.inventory(excludeEquipped).map(([i, cnt]) => {
            this.remove(i, cnt)
            corpse.add(i, cnt)
        })

        // + one equipped item goes to corpse
        const equipment = this.equipment()
        if (equipment.length > 0) {
            const toRemove = equipment[this.gameEngine.rand() % equipment.length]
            this.unequip(toRemove)
            this.remove(toRemove, 1)
            corpse.add(toRemove, 1)
        }
    }
}

Object.assign(Player.prototype, ActorMixin)

export { Player }