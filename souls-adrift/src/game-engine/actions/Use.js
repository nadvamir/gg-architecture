function processUse(args, gameEngine) {
    const [actor, item, target] = args.map(id => gameEngine.get(id))

    if (!item.isConsumable()) return
    if (!actor.hasItem(item.id, 1)) return

    actor.remove(item, 1)
    target.alterHealth(item.health())
}

export { processUse }