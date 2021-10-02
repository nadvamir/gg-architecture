import { gameEngine } from "./GameAssembly";
import { Action } from "./actions/ActionFactory";

let state = gameEngine.getState()
let interactionState = gameEngine.getInteractionState()

function attack(id) {
    if (interactionState.sending) return
    gameEngine.send(Action.Attack, [state.uid, id])
}

function pickUp(id, count) {
    if (interactionState.sending) return
    gameEngine.send(Action.PickUp, [state.uid, id, count])
}

function drop(id, count) {
    if (interactionState.sending) return
    gameEngine.send(Action.Drop, [state.uid, id, count])
}

function equip(id) {
    if (interactionState.sending) return
    gameEngine.send(Action.Equip, [state.uid, id])
}

function unequip(id) {
    if (interactionState.sending) return
    gameEngine.send(Action.Unequip, [state.uid, id])
}

function use(id, target) {
    if (interactionState.sending) return
    target = target || state.uid
    gameEngine.send(Action.Use, [state.uid, id, target])
}

function goTo(id) {
    if (interactionState.sending) return
    gameEngine.send(Action.GoTo, [state.uid, id])
}

function buy(id, count, seller) {
    if (interactionState.sending) return
    gameEngine.send(Action.Buy, [state.uid, id, count, seller])
}

function sell(id, count, buyer) {
    if (interactionState.sending) return
    gameEngine.send(Action.Sell, [state.uid, id, count, buyer])
}

function talk(message) {
    if (interactionState.sending) return
    gameEngine.sendToLoc(gameEngine.player().location(), Action.Talk, [state.uid, message])
}

function takeFrom(id, count, store) {
    if (interactionState.sending) return
    gameEngine.send(Action.TakeFrom, [state.uid, id, count, store])
}

export { attack, pickUp, drop, equip, unequip, use, goTo, buy, sell, talk, takeFrom }