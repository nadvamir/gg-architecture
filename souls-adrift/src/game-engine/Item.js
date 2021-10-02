import { produce } from 'solid-js/store';

import { deepCopy } from '../game-client/util/Util.js';
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
        return this.get('desc') || ''
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

    hasStorage() {
        return this.type() == "corpse" || this.type() == "store"
    }

    isMovable() {
        return !this.hasStorage() && this.type() != 'landmark'
    }

    // some items (corpses, crates) have storage capacity
    inventory() {
        const invDef = this.get('inventory')
        const inv = []
        if (!invDef) return inv
        for (const sid of Object.keys(invDef)) {
            const id = parseInt(sid, 10)
            let count = invDef[id]
            inv.push([this.gameEngine.get(id), count])
        }
        return inv
    }

    itemCount(itemId) {
        return this.get('inventory')[itemId] || 0
    }

    hasItem(item, count=1) {
        const id = item.id || item
        return this.itemCount(id) >= count
    }

    // --------- Prototype work -----------
    ensure(obj, property) {
        if (!(property in obj)) {
            obj[property] = deepCopy(this.src[property])
        }
    }

    // ------------ Modifiers ------------
    //TODO: extract inventory mixin
    add(item, count = 1) {
        if (count < 1) return
        this.gameEngine.setState(this.id, produce(actor => {
            this.ensure(actor, 'inventory')
            actor.inventory[item.id] = count + (actor.inventory[item.id] || 0)
        }))
    }

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
    }
}

export { Item }