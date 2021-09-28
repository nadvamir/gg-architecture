function processSell(args, gameEngine) {
    const [actor, item, count, buyer] = args
    gameEngine.recordEvent(actor + ' sold ' + count + ' of ' + item + ' from ' + buyer)
}

export { processSell }