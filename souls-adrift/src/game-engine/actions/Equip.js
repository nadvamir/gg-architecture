import { Reflection } from "../util/Reflection"

function processEquip(args, gameEngine) {
    const [actor, item] = args.map(id => gameEngine.get(id))

    if (!Reflection.isAlive(actor)) return
    if (!Reflection.isItem(item)) return
    if (!item.isEquippable()) return
    if (!item.canEquip(actor.skills)) return
    if (!actor.hasItem(item, 1)) return

    // only one item of each type is allowed, so unequip a clashing item
    const current = actor.equipment().filter(i => i.type() == item.type())
    if (current.length == 1) {
        actor.unequip(current[0])
    }

    actor.equip(item)
}

export { processEquip }