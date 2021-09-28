function processAttack(args, gameEngine) {
    const [attacker, target] = args
    gameEngine.recordEvent(attacker + ' attacked ' + target)
}

export { processAttack }