import { fulfillsConditions } from "../DialogueActions"
import { Reflection } from "../util/Reflection"

function giveItem(player, npc, action, shouldAnnounce) {
    const item = player.gameEngine.get(action[1])
    const count = action[2]

    if (!Reflection.isItem(item)) return
    if (!count > 0) return 

    player.unequip(item)
    player.remove(item, count)
    npc.add(item, count)

    if (shouldAnnounce) {
        const countMsg = count > 1 ? count + ' of ' : ''
        this.recordEvent(player.name() + ' gave ' + npc.name() + ' ' + countMsg + item.name())
    }
}

function gainItem(actor, action, shouldAnnounce) {
    const item = player.gameEngine.get(action[1])
    const count = action[2]

    if (!Reflection.isItem(item)) return
    if (!count > 0) return 

    actor.add(item, count)
    if (shouldAnnounce) {
        const countMsg = count > 1 ? count + ' of ' : ''
        this.recordEvent(player.name() + ' gained ' + countMsg + item.name() + 'from ' + npc.name())
    }
}

function runActions(player, npc, actions, shouldAnnounce) {
    for (const action of actions) {
        switch (action[0]) {
            case 'give_item':
                giveItem(player, npc, action, shouldAnnounce)
                break
            case 'gain_item':
                gainItem(player, action, shouldAnnounce)
                break
        }
    }
}

function processPickDialogue(args, gameEngine) {
    const player = gameEngine.get(args[0])
    const npc = gameEngine.get(args[1])
    const from = args[2]
    const to = args[3]

    if (!Reflection.isPlayer(player)) return
    if (!Reflection.isNpc(npc)) return
    if (!from || !to) return

    const fromD = npc.getDialogue(from)
    const toReply = fromD.r.find(r => r.l == to)

    if (!toReply) return
    if (!fulfillsConditions(player, npc, r.c)) return

    const shouldAnnounce = player.location().id == gameEngine.player().location().id

    runActions(player, npc, r.a, shouldAnnounce)
}

export { processPickDialogue }