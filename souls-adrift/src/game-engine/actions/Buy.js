function processBuy(args, gameEngine) {
    const [actor, item, count, seller] = args
    gameEngine.recordEvent(actor + ' bought ' + count + ' of ' + item + ' from ' + seller)
}

export { processBuy }