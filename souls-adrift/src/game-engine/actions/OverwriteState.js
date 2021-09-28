function processOverwriteState(args, gameEngine) {
    const [newState] = args
    gameEngine.recordEvent('New state: ' + JSON.stringify(newState))
}

export { processOverwriteState }