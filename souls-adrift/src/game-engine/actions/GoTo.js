function processGoTo(args, gameEngine) {
    const [actor, location] = args.map(id => gameEngine.get(id))
    const currentLocation = actor.location()
    if (!location.isReachableFrom(currentLocation, actor)) {
        console.log(actor.id, 'cannot reach', location.id)
        return
    }

    // update the state
    actor.setLocation(location)
    currentLocation.remove(actor, 1)
    location.add(actor, 1)
    // exit a fight
    const battleTarget = actor.battleTarget()
    if (!!battleTarget) {
        //TODO: chase
        actor.setBattle(0)
        battleTarget.setBattle(0)
    }

    // notify if we're around
    if (actor.id != gameEngine.playerId()) {
        const player = gameEngine.player()
        if (player.location().id == currentLocation.id) {
            gameEngine.recordEvent(actor.name() + ' left for ' + location.name())
        }
        else if (player.location().id == location.id) {
            gameEngine.recordEvent(actor.name() + ' arrived')
        }
    }
    else {
        gameEngine.clearEventList()
    }
}

export { processGoTo }