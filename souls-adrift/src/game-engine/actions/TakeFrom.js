function processTakeFrom(args, gameEngine) {
    const actor = gameEngine.get(args[0])
    const item = gameEngine.get(args[1])
    const count = args[2]
    const store = gameEngine.get(args[3])

    // can only buy from a store on the same location
    if (!actor.location().hasActor(store)) {
        console.log(actor.name(), 'and', store.name(), 'are too far apart')
        return
    }

    // the store must have the item in question
    if (!store.hasItem(item, count)) {
        console.log(store.name(), 'does not have ', count, 'of', item.name())
        return
    }

    // do the transaction
    store.remove(item, count)
    actor.add(item, count)

    const countMsg = count > 1 ? count + ' of ' : ''
    gameEngine.recordEvent(actor.name() + ' took ' + countMsg + item.name() + ' from ' + store.name())
}

export { processTakeFrom }