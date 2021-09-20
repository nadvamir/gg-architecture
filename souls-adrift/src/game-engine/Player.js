import { Item } from "./Item"

class Player {
    constructor(id, state, gameEngine) {
        this.id = id
        this.state = state
        this.gameEngine = gameEngine
    }

    hp() {
        return this.state.stats.hp
    }

    maxHp() {
        return this.state.skills.constitution * 10
    }

    exp() {
        return this.state.stats.exp
    }

    maxExp() {
        return Math.round(100 * Math.pow(2, this.state.stats.lvl - 1))
    }

    skillPoints() {
        return this.state.stats.skill_points
    }

    minDmg() {
        const baseDmg = this.state.stats.base_dmg || 0
        //TODO: add item damage
        return baseDmg + this.state.skills.strength
    }

    maxDmg() {
        //TODO: define player damage spred somewhere
        //TODO: add item damage
        const dmgSpread = 2
        return this.minDmg() + dmgSpread
    }

    armour() {
        //TODO: add item armour
        return 0
    }

    skills() {
        return this.state.skills
    }

    equipment() {
        return this.state.equipment.map(id => this.gameEngine.get(id))
    }

    inventory(excludeEquipped = true) {
        const inv = []
        for (const id of Object.keys(this.state.inventory)) {
            if (!excludeEquipped || this.state.equipment.find(e => e == id) === undefined) {
                inv.push([this.gameEngine.get(id), this.state.inventory[id]])
            }
        }
        return inv
    }
}

export { Player }