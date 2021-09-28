function processUnequip(args, gameEngine) {
    const [actor, item] = args
    gameEngine.recordEvent(actor + ' unequipped ' + item)
}

export { processUnequip }