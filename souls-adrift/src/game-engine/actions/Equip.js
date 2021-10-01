function processEquip(args, gameEngine) {
    const [actor, item] = args.map(id => gameEngine.get(id))

    if (!item.isEquippable()) return
    if (!item.canEquip(actor.skills)) return

    // only one item of each type is allowed, so unequip a clashing item
    const current = actor.equipment().filter(i => i.type() == item.type())
    if (current.length == 1) {
        actor.unequip(current[0])
    }

    actor.equip(item)
}

export { processEquip }