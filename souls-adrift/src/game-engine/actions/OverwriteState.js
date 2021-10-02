function processOverwriteState(args, gameEngine) {
    const [newState] = args
    gameEngine.setState(newState)
}

export { processOverwriteState }