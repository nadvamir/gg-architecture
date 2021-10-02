function processTalk(args, gameEngine) {
    const actor = gameEngine.get(args[0])
    const message = args[1]
    gameEngine.recordEvent(actor.name() + ': ' + message)
}

export { processTalk }