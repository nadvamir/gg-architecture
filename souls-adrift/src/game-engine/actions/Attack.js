import { Reflection } from "../util/Reflection"

function processAttack(args, gameEngine, riposte = false) {
    const [attacker, target] = args.map(id => gameEngine.get(id))

    if (!Reflection.isAlive(attacker)) return
    if (!Reflection.isAlive(target)) return

    // has to be on the same location
    if (attacker.location().id != target.location().id) {
        console.log(attacker.name(), 'and', target.name(), 'are too far apart')
        return
    }
    const eventsVisible = attacker.location().id == gameEngine.player().location().id

    // enter the battle or switch a target
    attacker.setBattle(target)
    target.setBattle(attacker)

    // success roll
    if (gameEngine.rand() <= attacker.attackSuccessChance(target)) {
        // critical hit roll
        const mult = gameEngine.rand() <= attacker.criticalChance() ? 2 : 1
        const minDmg = attacker.minDmg() * mult
        const maxDmg = attacker.maxDmg() * mult
        const dmg = Math.round(minDmg + (maxDmg - minDmg) * gameEngine.rand() / 100)

        eventsVisible && gameEngine.recordEvent(attacker.name() + ' has dealt ' + dmg + ' damage to ' + target.name())

        target.alterHealth(-dmg)
    }
    else {
        eventsVisible && gameEngine.recordEvent(attacker.name() + ' has missed')
    }

    // if we killed the target, gain exp
    if (target.hp() == 0) {
        attacker.gainExperience && attacker.gainExperience(target)
    }

    // automatic riposte:
    if (!riposte && target.hp() > 0) {
        processAttack([target.id, attacker.id], gameEngine, true)
    }
}

export { processAttack }