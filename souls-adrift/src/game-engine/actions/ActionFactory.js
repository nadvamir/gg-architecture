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
    static TakeFrom = 9
    static EndOfIntActions = 1000
    static Talk = 1001
    static OverwriteState = 1002

    static getProcessor(action) {
        switch (action) {
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
        }
        console.log(action, ' not found')
    }
}

export { Action }