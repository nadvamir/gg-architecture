import { infoModalController } from "../modals/InfoModalController.js"
import { equip, unequip, use, drop } from "../../game-engine/GameActions";

function ItemInfoLink(props) {
    const item = props.item
    return (<a onclick={() => infoModalController.showInfo('item', item.id)}>{item.name()}</a>)
}

function EquipItemLink(props) {
    const item = props.item
    if (!item.isEquippable()) return (<></>)
    if (!item.canEquip(props.skills)) return (<> — equip</>)
    return (<> —  <a onclick={() => equip(item.id)}>equip</a></>)
}

function UnequipItemLink(props) {
    const item = props.item
    return (<> — <a onclick={() => unequip(item.id)}>unequip</a></>)
}

function ConsumeItemLink(props) {
    const item = props.item
    if (!item.isConsumable()) return (<></>)
    return (<> —  <a onclick={() => use(item.id)}>consume</a></>)
}

function DropItemLink(props) {
    const item = props.item
    return (<> — <a onclick={() => drop(item.id)}>drop</a></>)
}

function ItemCountIndicator(props) {
    if (props.count == 1) return (<></>)
    return (<> ({props.count})</>)
}

export {
    ItemInfoLink,
    EquipItemLink,
    UnequipItemLink,
    ConsumeItemLink,
    DropItemLink,
    ItemCountIndicator
}
