import { produce } from 'solid-js/store';
import { deepCopy } from '../game-client/util/Util';

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

    skill(skillName) {
        return this.skills()[skillName] || 0
    },

    level() {
        const stats = this.get('stats')
        return stats.lvl
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
        const equipment = this.get('equipment')
        const inv = []
        for (const sid of Object.keys(invDef)) {
            const id = parseInt(sid, 10)
            let count = invDef[id]
            if (excludeEquipped && equipment.indexOf(id) != -1) {
                count -= 1
            }
            if (count > 0) {
                inv.push([this.gameEngine.get(id), count])
            }
        }
        return inv
    },

    itemCount(itemId) {
        return this.get('inventory')[itemId] || 0
    },

    moneyCount() {
        return this.itemCount(this.gameEngine.moneyId())
    },

    hasItem(item, count=1) {
        const id = item.id || item
        return this.itemCount(id) >= count
    },

    canAfford(cost) {
        return this.moneyCount() >= cost
    },

    battleTarget() {
        const battle = this.get('battle')
        if (!battle) return
        return this.gameEngine.get(battle)
    },

    isBattling(actorId = 0) {
        const battle = this.get('battle')
        if (!actorId) return !!battle
        return battle == actorId
    },

    location() {
        return this.gameEngine.get(this.get('location'))
    },

    attackPoints() {
        const skills = this.skills()
        let basePoints = skills.dexterity + 1

        const weapon = this.equippedWeapon()
        if (!!weapon) {
            const required = weapon.skills()
            for (let s of Object.keys(required)) {
                if (s == 'dexterity') basePoints -= required[s]
                else basePoints += skills[s] - required[s]
            }
        }

        // adjust by how bled out you are
        basePoints *= 100 * this.hp() / this.maxHp()

        return Math.round(basePoints)
    },

    criticalChance() {
        return Math.round(100 * (this.maxHp() - this.hp()) / this.maxHp())
    },

    attackSuccessChance(opponent) {
        const points = this.attackPoints()
        const opponentPoints = opponent.attackPoints()
        return Math.round(100 * points / (points + opponentPoints))
    },

    // --------- Prototype work -----------
    ensure(obj, property) {
        if (!(property in obj)) {
            obj[property] = deepCopy(this.src[property])
        }
    },

    // ------------ Modifiers -------------
    setLocation(location) {
        this.gameEngine.setState(this.id, produce(actor => {
            actor.location = location.id
        }))
    },

    setBattle(opponent) {
        this.gameEngine.setState(this.id, produce(actor => {
            actor.battle = !!opponent ? opponent.id : 0
        }))
    },

    add(item, count = 1) {
        if (count < 1) return
        this.gameEngine.setState(this.id, produce(actor => {
            this.ensure(actor, 'inventory')
            actor.inventory[item.id] = count + (actor.inventory[item.id] || 0)
        }))
    },

    remove(item, count = 1) {
        if (count < 1) return
        this.gameEngine.setState(this.id, produce(actor => {
            this.ensure(actor, 'inventory')
            if (!(item.id in actor.inventory)) return
            if (actor.inventory[item.id] <= count) {
                delete actor.inventory[item.id]
            }
            else {
                actor.inventory[item.id] -= count
            }
        }))
    },

    equip(item) {
        this.gameEngine.setState(this.id, produce(actor => {
            this.ensure(actor, 'equipment')
            actor.equipment.push(item.id)
        }))
    },

    unequip(item) {
        this.gameEngine.setState(this.id, produce(actor => {
            this.ensure(actor, 'equipment')
            actor.equipment = actor.equipment.filter(id => id != item.id)
        }))
    },

    alterHealth(diff) {
        let isDead = false
        this.gameEngine.setState(this.id, produce(actor => {
            this.ensure(actor, 'stats')
            actor.stats.hp += diff
            if (actor.stats.hp > this.maxHp()) {
                actor.stats.hp = this.maxHp()
            }
            else if (actor.stats.hp <= 0) {
                actor.stats.hp = 0
                isDead = true
            }
        }))

        if (isDead) {
            this.die()
        }
    },

    train(skill) {
        this.gameEngine.setState(this.id, produce(actor => {
            this.ensure(actor, 'skills')
            actor.skills[skill] += 1
        }))
    }
}

export { ActorMixin }