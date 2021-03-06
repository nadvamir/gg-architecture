import { Reflection } from "../util/Reflection"

function processGoTo(args, gameEngine) {
    const [actor, location] = args.map(id => gameEngine.get(id))

    if (!Reflection.isAlive(actor)) return
    if (!Reflection.isLocation(location)) return

    const currentLocation = actor.location()
    if (!location.isReachableFrom(currentLocation, actor)) {
        console.log(gameEngine.playerId(), ':', actor.id, 'cannot reach', location.id, 'from', currentLocation.id)
        return
    }

    // update the state
    actor.setLocation(location)
    currentLocation.remove(actor, 1)
    location.add(actor, 1)

    // notify if we're around
    // do this before the chasing mechanic, so that chase logs aren't cleared
    if (actor.id != gameEngine.playerId()) {
        const player = gameEngine.player()
        if (player.location().id == currentLocation.id) {
            gameEngine.recordEvent(actor.name() + ' has left for ' + location.name())
        }
        else if (player.location().id == location.id) {
            gameEngine.recordEvent(actor.name() + ' has arrived')
        }
    }
    else {
        gameEngine.clearEventList()
    }

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
        if (gameEngine.rand() <= hostile.chaseChance()) {
            // chase
            processGoTo([hostile.id, location.id], gameEngine)
        }
        else {
            // stop fighting
            hostile.setBattle(0)
        }
    })
}

export { processGoTo }