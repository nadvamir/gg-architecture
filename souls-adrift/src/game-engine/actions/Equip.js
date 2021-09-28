function processEquip(args, gameEngine) {
    const [actor, item] = args
    gameEngine.recordEvent(actor + ' equipped ' + item)
}

export { processEquip }