function processPickUp(args, gameEngine) {
    const actor = gameEngine.get(args[0])
    const item = gameEngine.get(args[1])
    const count = args[2]

    const location = actor.location()

    // verify that the player can pick up
    if (!location.hasActor(item, count)) {
        console.log(location.name(), 'does not have ', count, ' of ', item.name())
        return
    }
    if (!item.isMovable()) {
        console.log(item.name(), 'cannot be picked up')
        return
    }

    location.remove(item, count)
    actor.add(item, count)

    // if an item naturally spawns here, enqueue respawn
    const num = Math.min(count, location.numItemsSpawningHere(item))
    if (num) {
        gameEngine.enqueueRespawn(item, location.id, num)
    }

    const countMsg = count > 1 ? count + ' of ' : ''
    gameEngine.recordEvent(actor.name() + ' picked up ' + countMsg + item.name())
}

export { processPickUp }