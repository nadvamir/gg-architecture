// A set of methods common to all players and NPC
const ActorMixin = {
    name() {
        return this.get('name')
    },

    hp() {
        const stats = this.get('stats')
        return stats.hp
    },

    maxHp() {
        return this.skills().constitution * 10
    },

    minDmg() {
        const stats = this.get('stats')
        const baseDmg = stats.base_dmg || 0
        const weaponDmg = this.equipment().reduce((acc, i) => acc + i.minDmg(), 0) || baseDmg
        return weaponDmg + this.skills().strength
    },

    maxDmg() {
        const stats = this.get('stats')
        const baseDmgSpread = stats.dmg_spread || 2
        const weaponDmgSpread = this.equipment().reduce((acc, i) => acc + i.maxDmg() - i.minDmg(), 0) || baseDmgSpread
        return this.minDmg() + weaponDmgSpread
    },

    armour() {
        return this.equipment().reduce((acc, i) => acc + i.armour(), 0)
    },

    skills() {
        return this.get('skills')
    },

    equipment() {
        return this.get('equipment').map(id => this.gameEngine.get(id))
    },

    equippedWeapon() {
        const weapons = this.equipment().filter(i => i.type() == 'weapon')
        if (weapons.length == 0) return
        return weapons[0]
    },

    equippedArmour() {
        return this.equipment().filter(i => i.category() == 'a')
    },

    inventory(excludeEquipped = true) {
        const invDef = this.get('inventory')
        const equipment = this.equipment()
        const inv = []
        for (const sid of Object.keys(invDef)) {
            const id = parseInt(sid, 10)
            if (!excludeEquipped || equipment.indexOf(id) == -1) {
                inv.push([this.gameEngine.get(id), invDef[id]])
            }
        }
        return inv
    },

    itemCount(item) {
        return this.get('inventory')[item] || 0
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
        const battle = this.get('battle')
        if (!battle) return
        return this.gameEngine.get(battle)
    },

    location() {
        return this.gameEngine.get(this.get('location'))
    }
}

export { ActorMixin }