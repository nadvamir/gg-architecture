function processUse(args, gameEngine) {
    const [actor, item] = args
    gameEngine.recordEvent(actor + ' used ' + item)
}

export { processUse }