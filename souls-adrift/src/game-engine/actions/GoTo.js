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

    // exit a fight if target is not in the location
    // (i.e. always apart from when chasing)
    const battleTarget = actor.battleTarget()
    if (!!battleTarget) {
        if (!location.hasActor(battleTarget)) {
            actor.setBattle(0)
        }
    }
    // but actors that are fighting can chose to chase
    currentLocation.actorsFighting(actor).map(hostile => {
        const r = gameEngine.rand()
        if (r <= hostile.chaseChance()) {
            // chase
            processGoTo([hostile.id, location.id], gameEngine)
        }
        else {
            // stop fighting
            hostile.setBattle(0)
        }
    })

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