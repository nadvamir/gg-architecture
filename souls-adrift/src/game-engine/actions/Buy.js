import { Reflection } from "../util/Reflection"

function processBuy(args, gameEngine) {
    const actor = gameEngine.get(args[0])
    const item = gameEngine.get(args[1])
    const count = args[2]
    const seller = gameEngine.get(args[3])

    if (!Reflection.isPlayer(actor)) return
    if (!Reflection.isItem(item)) return
    if (count < 1) return
    if (!Reflection.isNpc(seller)) return

    // can only buy from a seller on the same location
    if (actor.location().id != seller.location().id) {
        console.log(actor.name(), 'and', seller.name(), 'are too far apart')
        return
    }

    // the seller must have the item in question
    if (!seller.hasForSale(item, count, actor)) {
        console.log(seller.name(), 'does not have ', count, 'of', item.name())
        return
    }

    // the buyer must have the resources
    const cost = seller.askPrice(item, actor) * count
    if (!actor.canAfford(cost)) {
        console.log(actor.name(), 'does not have enough money to buy ', item.name(), ', needs', cost)
        return
    }

    const eventsVisible = actor.location().id == gameEngine.player().location().id

    // do the transaction
    const money = gameEngine.money()
    actor.remove(money, cost)
    seller.add(money, cost)
    seller.remove(item, count)
    actor.add(item, count)

    const countMsg = count > 1 ? count + ' of ' : ''
    const costMsg = ' (-' + cost + ' ' + money.name() + ')'
    eventsVisible && gameEngine.recordEvent(actor.name() + ' bought ' + countMsg + item.name() + ' from ' + seller.name() + costMsg)
}

export { processBuy }