function processPickUp(args, gameEngine) {
    const actor = gameEngine.get(args[0])
    const item = gameEngine.get(args[1])
    const count = args[2]

    const location = actor.location()

    // verify that the player can drop
    if (!location.hasActor(item, count)) {
        console.log(location.name(), 'does not have ', count, ' of ', item.name())
        return
    }

    location.remove(item, count)
    actor.add(item, count)

    const countMsg = count > 1 ? count + ' of ' : ''
    gameEngine.recordEvent(actor.name() + ' picked up ' + countMsg + item.name())
}

export { processPickUp }