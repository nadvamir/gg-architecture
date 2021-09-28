import { Action } from './actions/ActionFactory.js'

function serialise(action, args) {
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
    return [action, args]
}

export { serialise, deserialise }