import { Action } from '../game-engine/actions/ActionFactory.js'

function serialise(action, args) {
    if (action == Action.OverwriteState) {
        return action + '|' + JSON.stringify(args)
    }
    if (action == Action.Talk) {
        args[1].replace('|', '')
    }
    return action + '|' + args.join('|')
}

function deserialise(message) {
    const parts = message.split('|')
    const action = parseInt(parts[0], 10)
    let args;
    if (action < Action.EndOfIntActions) {
        args = parts.slice(1).map(x => parseInt(x, 10))
    }
    else if (action == Action.Talk) {
        args = [parseInt(parts[1], 10), parts[2]]
    }
    else if (action == Action.OverwriteState) {
        args = [JSON.parse(parts[1])]
    }
    else if (action == Action.PickDialogue) {
        args = [parseInt(parts[1], 10), parseInt(parts[2], 10), parts[3], parts[4]]
    }
    return [action, args]
}

export { serialise, deserialise }