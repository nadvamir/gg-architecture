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

    description() {
        return this.get('desc') || ''
    }

    forSale() {
        const trade = this.get('trade')
        return this.inventory().filter(([item, _]) => trade.for_sale.indexOf(item.id) != -1)
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
}

Object.assign(Npc.prototype, ActorMixin)

export { Npc }