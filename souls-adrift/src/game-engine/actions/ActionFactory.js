import { processAttack } from './Attack.js'
import { processPickUp } from './PickUp.js'
import { processDrop } from './Drop.js'
import { processEquip } from './Equip.js'
import { processUnequip } from './Unequip.js'
import { processUse } from './Use.js'
import { processGoTo } from './GoTo.js'
import { processBuy } from './Buy.js'
import { processSell } from './Sell.js'
import { processTakeFrom } from './TakeFrom.js'
import { processTalk } from './Talk.js'
import { processOverwriteState } from './OverwriteState.js'
import { processPickDialogue } from './PickDialogue.js'

class Action {
    static None = 0
    static Attack = 1
    static PickUp = 2
    static Drop = 3
    static Equip = 4
    static Unequip = 5
    static Use = 6
    static GoTo = 7
    static Buy = 8
    static Sell = 9
    static TakeFrom = 10
    static EndOfIntActions = 1000
    static Talk = 1001
    static OverwriteState = 1002
    static PickDialogue = 1003

    static getProcessor(action) {
        switch (action) {
            case Action.None: return () => {} // used as a heartbeat
            case Action.Attack: return processAttack
            case Action.PickUp: return processPickUp
            case Action.Drop: return processDrop
            case Action.Equip: return processEquip
            case Action.Unequip: return processUnequip
            case Action.Use: return processUse
            case Action.GoTo: return processGoTo
            case Action.Buy: return processBuy
            case Action.Sell: return processSell
            case Action.TakeFrom: return processTakeFrom
            case Action.Talk: return processTalk
            case Action.OverwriteState: return processOverwriteState
            case Action.PickDialogue: return processPickDialogue
        }
        console.log(action, ' not found')
    }
}

export { Action }