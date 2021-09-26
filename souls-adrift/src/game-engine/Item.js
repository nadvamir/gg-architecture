import { ItemDefinitions } from './data/ItemDefinitions.js'

class Item {
    constructor(id, state, gameEngine) {
        this.id = id
        this.state = state
        this.gameEngine = gameEngine
        this.src = ItemDefinitions[this.state.src]
    }

    get(field) {
        if (field in this.state) return this.state[field]
        return this.src[field]
    }

    name() {
        return this.get('name')
    }

    description() {
        //TODO: use a real description
        return 'A sharp rusty piece of metal tied to a wooden handle.'
    }

    value() {
        return this.get('value') || 0
    }

    type() {
        return this.get('type')
    }

    // i.X.name -> X is a category that's broader than type
    category() {
        return this.state.src[2]
    }

    minDmg() {
        return this.get('min_dmg') || 0
    }

    maxDmg() {
        return this.get('max_dmg') || 0
    }

    armour() {
        return this.get('armour') || 0
    }

    health() {
        return this.get('health') || 0
    }

    skills() {
        return this.get('skills') || {}
    }

    isEquippable() {
        const equippable = ["weapon", "helmet", "armour", "gloves", "boots", "ring", "amulet"]
        return equippable.indexOf(this.type()) !== -1
    }

    canEquip(skills) {
        if (!this.isEquippable()) return false
        const required = this.get('skills')
        if (!required) return true
        for (const s of Object.keys(required)) {
            if (!skills[s] || skills[s] < required[s]) return false
        }
        return true
    }

    isConsumable() {
        return this.type() == "consumable"
    }
}

export { Item }