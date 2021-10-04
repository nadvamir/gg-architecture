import { Reflection } from "../util/Reflection"

function processDrop(args, gameEngine) {
    const actor = gameEngine.get(args[0])
    const item = gameEngine.get(args[1])
    const count = args[2]

    if (!Reflection.isAlive(actor)) return
    if (!Reflection.isItem(item)) return
    if (count < 1) return

    // verify that the player can drop
    if (!actor.hasItem(item, count)) {
        console.log(actor.name(), 'does not have ', count, ' of ', item.name())
        return
    }

    // unequip if equipped
    actor.unequip(item)

    actor.remove(item, count)
    actor.location().add(item, count)
    gameEngine.enqueueDespawn(item, actor.location().id, count)

    if (actor.location().id == gameEngine.player().location().id) {
        const countMsg = count > 1 ? count + ' of ' : ''
        gameEngine.recordEvent(actor.name() + ' dropped ' + countMsg + item.name())
    }
}

export { processDrop }