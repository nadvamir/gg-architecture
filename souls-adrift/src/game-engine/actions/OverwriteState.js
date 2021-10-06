function processOverwriteState(args, gameEngine) {
    const [newState] = args
    if (!!gameEngine.state.uid) {
        gameEngine.setState(newState)
    }
    else {
        console.log('Loading game state for uid ' + newState.uid)
        gameEngine.loadGameState(newState)
    }
}

export { processOverwriteState }