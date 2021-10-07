function processOverwriteState(args, gameEngine) {
    const [newState] = args
    if (gameEngine.isLoaded()) {
        gameEngine.setState(newState)
    }
    else {
        console.log('Loading game state for uid ' + newState.uid)
        gameEngine.loadGameState(newState)
    }
}

export { processOverwriteState }