import { Reflection } from "../util/Reflection"

function processUse(args, gameEngine) {
    const [actor, item, target] = args.map(id => gameEngine.get(id))

    if (!Reflection.isAlive(actor)) return
    if (!Reflection.isItem(item)) return
    if (!Reflection.isAlive(target)) return
    if (!item.isConsumable()) return
    if (!actor.hasItem(item, 1)) return

    actor.remove(item, 1)
    target.alterHealth(item.health())
}

export { processUse }