import { Reflection } from "../util/Reflection"

function processUnequip(args, gameEngine) {
    const [actor, item] = args.map(id => gameEngine.get(id))

    if (!Reflection.isAlive(actor)) return
    if (!Reflection.isItem(item)) return

    actor.unequip(item)
}

export { processUnequip }