function hasItem(actor, args) {
    return actor.itemCount(args[0]) >= args[1]
}

function fulfillsCondition(player, npc, condition) {
    const cname = condition[0]
    const args = condition.slice(1)
    switch(cname) {
        case 'player_has_item': return hasItem(player, args)
        case 'npc_has_item': return hasItem(npc, args)
        case 'player_has_no_item': return !hasItem(player, args)
        case 'npc_has_no_item': return !hasItem(npc, args)
    }
}

function fulfillsConditions(player, npc, conditions) {
    if (!conditions) return true
    for (const condition of conditions) {
        if (!fulfillsCondition(player, npc, condition)) {
            return false
        }
        return true
    }
}

export { fulfillsConditions }