import { produce } from "solid-js/store"
import { deepCopy } from "../game-client/util/Util"
import { ActorMixin } from "./ActorMixin"
import { NpcDefinitions } from './data/NpcDefinitions.js'

class Npc {
    constructor(id, state, gameEngine) {
        this.id = id
        this.state = state
        this.gameEngine = gameEngine
        this.src = NpcDefinitions[this.state.src]
    }

    get(field) {
        if (field in this.state) return this.state[field]
        return this.src[field]
    }

    type() {
        return this.get('type')
    }

    // n.X.name -> X is a category that's broader than type
    category() {
        return this.state.src[2]
    }

    description() {
        return this.get('desc') || ''
    }

    forSale() {
        const trade = this.get('trade')
        return this.inventory().filter(([item, _]) => trade.for_sale.indexOf(item.type()) != -1)
    }

    willBuy(inventory) {
        const trade = this.get('trade')
        return inventory.filter(([item, _]) => trade.to_buy.indexOf(item.type()) != -1)
    }

    bidPrice(item, player) {
        const trade = this.get('trade')
        // player here for the future, some NPC could for example cheapen the items after passing a quest
        return Math.round(item.value() * trade.buy)
    }

    askPrice(item, player) {
        const trade = this.get('trade')
        // player here for the future, some NPC could for example cheapen the items after passing a quest
        return Math.round(item.value() * trade.sell)
    }

    hasForSale(item, count, player) {
        // player here for the future, in case items become available only after a quest
        return this.forSale().filter(([i, c]) => i.id == item.id && c >= count).length > 0
    }

    getDialogue(dialogueItem) {
        const dialogue = this.get('dialogue') || {}
        return dialogue[dialogueItem] || {'t': 'Hmm...', 'r': []}
    }

    chaseChance() {
        switch (this.category()) {
            // Tame NPCs have a 33% chance of chasing after the attacker
            case 'a': return 33
            // Aggro NPCs have a 75% chance of chasing 
            case 'x': return 75
            // Traders and guards will always chase
            case 't': return 100
        }
        return 0
    }

    canRoam() {
        const category = this.category()
        return category == 'a' || category == 'x'
    }

    isTrader() {
        return this.category() == 't'
    }

    // --------- Modifiers -----------
    die() {
        this.gameEngine.recordEvent(this.name() + ' has died!')
        const location = this.location()
        location.remove(this)
        location.actorsFighting(this).map(a => a.setBattle(0))
        this.gameEngine.createCorpse(this)
        this.gameEngine.remove(this)
        this.gameEngine.enqueueRespawn(this, this.state.spawn_point)
    }

    moveItemsToCorpse(corpse) {
        // for the NPC, the entire inventory goes to corpse
        // including equipped items
        const excludeEquipped = false
        this.inventory(excludeEquipped).map(([i, cnt]) => {
            this.unequip(i)
            this.remove(i, cnt)
            corpse.add(i, cnt)
        })
    }

    resetInventory() {
        this.gameEngine.setState(this.id, produce((npc) => {
            npc.inventory = deepCopy(this.src.inventory)
        }))
    }
}

Object.assign(Npc.prototype, ActorMixin)

export { Npc }