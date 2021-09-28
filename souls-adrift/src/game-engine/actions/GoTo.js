function processGoTo(args, gameEngine) {
    const [actor, location] = args
    gameEngine.recordEvent(actor + ' went to ' + location)
}

export { processGoTo }