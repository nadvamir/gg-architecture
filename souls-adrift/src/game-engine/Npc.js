import { ActorMixin } from "./ActorMixin"

class Npc {
    constructor(id, state, gameEngine) {
        this.id = id
        this.state = state
        this.gameEngine = gameEngine
    }

    type() {
        return this.state.type
    }

    description() {
        //TODO: return a real description
        return 'A man of unspecified age.'
    }

    forSale() {
        return this.inventory().filter(([item, _]) => this.state.trade.for_sale.indexOf(item.id) != -1)
    }

    willBuy(inventory) {
        return inventory.filter(([item, _]) => this.state.trade.to_buy.indexOf(item.type()) != -1)
    }

    bidPrice(item, player) {
        // player here for the future, some NPC could for example cheapen the items after passing a quest
        return Math.round(item.value() * this.state.trade.buy)
    }

    askPrice(item, player) {
        // player here for the future, some NPC could for example cheapen the items after passing a quest
        return Math.round(item.value() * this.state.trade.sell)
    }
}

Object.assign(Npc.prototype, ActorMixin)

export { Npc }