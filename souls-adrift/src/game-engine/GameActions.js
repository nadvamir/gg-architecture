import { gameEngine } from "./GameAssembly";

let state = gameEngine.getState()
let interactionState = gameEngine.getInteractionState()

class Action {
    static Attack = 0
    static PickUp = 1
    static Drop = 2
    static Equip = 3
    static Unequip = 4
    static Use = 5
    static GoTo = 6
    static Buy = 7
    static Sell = 8
}

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

function use(id) {
    if (interactionState.sending) return
    gameEngine.send(Action.Use, [state.uid, id])
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

export { attack, pickUp, drop, equip, unequip, use, goTo, buy, sell }