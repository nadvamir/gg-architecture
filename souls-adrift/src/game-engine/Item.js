class Item {
    constructor(id, state, gameEngine) {
        this.id = id
        this.state = state
        this.gameEngine = gameEngine
    }

    name() {
        return this.state.name
    }

    description() {
        //TODO: use a real description
        return 'A sharp rusty piece of metal tied to a wooden handle.'
    }

    value() {
        return this.state.value || 0
    }

    type() {
        return this.state.type
    }

    minDmg() {
        return this.state.min_dmg || 0
    }

    maxDmg() {
        return this.state.max_dmg || 0
    }

    armour() {
        return this.state.armour || 0
    }

    health() {
        return this.state.health || 0
    }

    skills() {
        return this.state.skills || {}
    }

    isEquippable() {
        const equippable = ["weapon", "helmet", "armour", "gloves", "boots", "ring", "amulet"]
        return equippable.indexOf(this.state.type) !== -1
    }

    canEquip(skills) {
        if (!this.isEquippable()) return false
        if (!this.state.skills) return true
        for (const s of Object.keys(this.state.skills)) {
            if (!skills[s] || skills[s] < this.state.skills[s]) return false
        }
        return true
    }
    
    isConsumable() {
        return this.state.type == "consumable"
    }
}

export { Item }