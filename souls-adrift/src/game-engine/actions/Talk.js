function processTalk(args, gameEngine) {
    const [actor, message] = args
    gameEngine.recordEvent(args[0] + ': ' + message)
}

export { processTalk }