function processSell(args, gameEngine) {
    const actor = gameEngine.get(args[0])
    const item = gameEngine.get(args[1])
    const count = args[2]
    const buyer = gameEngine.get(args[3])

    // can only sell to a buyer on the same location
    if (actor.location().id != buyer.location().id) {
        console.log(actor.name(), 'and', buyer.name(), 'are too far apart')
        return
    }

    // the seller must have the item in question
    if (!actor.hasItem(item.id, count)) {
        console.log(actor.name(), 'does not have ', count, 'of', item.name())
        return
    }

    // the buyer must have the resources
    const cost = buyer.bidPrice(item, actor) * count
    if (!buyer.canAfford(cost)) {
        console.log(buyer.name(), 'does not have enough money to buy ', item.name(), ', needs', cost)
    }

    // unequip if equipped
    actor.unequip(item)

    // do the transaction
    const money = gameEngine.money()
    buyer.remove(money, cost)
    actor.add(money, cost)
    actor.remove(item, count)
    buyer.add(item, count)

    const countMsg = count > 1 ? count + ' of ' : ''
    const costMsg = ' (+' + cost + ' ' + money.name() + ')'
    gameEngine.recordEvent(actor.name() + ' sold ' + countMsg + item.name() + ' to ' + buyer.name() + costMsg)
}

export { processSell }