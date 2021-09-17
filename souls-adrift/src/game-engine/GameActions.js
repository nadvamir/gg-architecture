import { gameEngine } from "./GameAssembly";

let state = gameEngine.getState()
let interactionState = gameEngine.getInteractionState()

function attack(id) {
    if (interactionState.sending) return
    gameEngine.send('attack ' + id)
}

function pickUp(id) {
    if (interactionState.sending) return
    gameEngine.send('pickUp ' + id)
}

function drop(id) {
    if (interactionState.sending) return
    gameEngine.send('drop ' + id)
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

function buy(id) {
    if (interactionState.sending) return
    gameEngine.send('buy ' + id)
}

function sell(id) {
    if (interactionState.sending) return
    gameEngine.send('sell ' + id)
}

export { attack, pickUp, drop, equip, unequip, use, goTo, buy, sell }