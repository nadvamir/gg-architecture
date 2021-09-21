// A set of methods common to all players and NPC
const ActorMixin = {
    name() {
        return this.state.name
    },

    hp() {
        return this.state.stats.hp
    },

    maxHp() {
        return this.state.skills.constitution * 10
    },

    minDmg() {
        const baseDmg = this.state.stats.base_dmg || 0
        //TODO: add item damage
        return baseDmg + this.state.skills.strength
    },

    maxDmg() {
        //TODO: define player damage spred somewhere
        //TODO: add item damage
        const dmgSpread = 2
        return this.minDmg() + dmgSpread
    },

    armour() {
        //TODO: add item armour
        return 0
    },

    skills() {
        return this.state.skills
    },

    equipment() {
        return this.state.equipment.map(id => this.gameEngine.get(id))
    },

    inventory(excludeEquipped = true) {
        const inv = []
        for (const sid of Object.keys(this.state.inventory)) {
            const id = parseInt(sid, 10)
            if (!excludeEquipped || this.state.equipment.indexOf(id) == -1) {
                inv.push([this.gameEngine.get(id), this.state.inventory[id]])
            }
        }
        return inv
    },

    itemCount(item) {
        return this.state.inventory[item] || 0
    },

    moneyCount() {
        return this.itemCount(this.gameEngine.moneyId())
    },

    hasItem(item, count=1) {
        return this.itemCount(item) >= count
    },

    canAfford(cost) {
        return this.hasItem(this.gameEngine.moneyId(), cost)
    },

    battleTarget() {
        if (!this.state.battle) return
        return this.gameEngine.get(this.state.battle)
    },

    location() {
        return this.gameEngine.get(this.state.location)
    }
}

export { ActorMixin }