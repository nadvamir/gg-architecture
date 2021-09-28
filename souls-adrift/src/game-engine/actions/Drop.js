function processDrop(args, gameEngine) {
    const [actor, item, count] = args
    gameEngine.recordEvent(actor + ' dropped ' + count + ' of ' + item)
}

export { processDrop }