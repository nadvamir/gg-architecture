function processUnequip(args, gameEngine) {
    const [actor, item] = args.map(id => gameEngine.get(id))

    actor.unequip(item)
}

export { processUnequip }