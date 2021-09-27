import { gameEngine } from "./GameAssembly";

let state = gameEngine.getState()
let interactionState = gameEngine.getInteractionState()

function attack(id) {
    if (interactionState.sending) return
    gameEngine.send('attack ' + id)
}

function pickUp(id, count) {
    if (interactionState.sending) return
    gameEngine.send('pickUp ' + count + ' of ' + id)
}

function drop(id, count) {
    if (interactionState.sending) return
    gameEngine.send('drop ' + count + ' of ' + id)
}

function equip(id) {
    if (interactionState.sending) return
    gameEngine.send('equip ' + id)
}

function unequip(id) {
    if (interactionState.sending) return
    gameEngine.send('unequip ' + id)
}

function use(id) {
    if (interactionState.sending) return
    gameEngine.send('use ' + id)
}

function goTo(id) {
    if (interactionState.sending) return
    gameEngine.send('goTo ' + id)
}

function buy(id, count) {
    if (interactionState.sending) return
    gameEngine.send('buy ' + count + ' of ' + id)
}

function sell(id, count) {
    if (interactionState.sending) return
    gameEngine.send('sell ' + count + ' of ' + id)
}

export { attack, pickUp, drop, equip, unequip, use, goTo, buy, sell }