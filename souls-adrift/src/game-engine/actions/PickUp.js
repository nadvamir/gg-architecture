function processPickUp(args, gameEngine) {
    const [actor, item, count] = args
    gameEngine.recordEvent(actor + ' picked up ' + count + ' of ' + item)
}

export { processPickUp }