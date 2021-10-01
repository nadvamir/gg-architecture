function processDrop(args, gameEngine) {
    const actor = gameEngine.get(args[0])
    const item = gameEngine.get(args[1])
    const count = args[2]

    // verify that the player can drop
    if (!actor.hasItem(item.id, count)) {
        console.log(actor.name, 'does not have ', count, ' of ', item.name())
        return
    }

    // unequip if equipped
    actor.unequip(item)

    actor.remove(item, count)
    actor.location().add(item, count)

    const countMsg = count > 1 ? count + ' of ' : ''
    gameEngine.recordEvent(actor.name() + ' dropped ' + countMsg + item.name())
}

export { processDrop }