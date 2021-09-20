import { equip, unequip, use, drop } from "../../game-engine/GameActions";

function EquipItemLink(props) {
    const item = props.item
    if (!item.isEquippable()) return ''
    if (!item.canEquip(props.skills)) return (<> — equip</>)
    return (<> —  <a onclick={() => equip(item.id)}>equip</a></>)
}

function UnequipItemLink(props) {
    const item = props.item
    return (<> — <a onclick={() => unequip(item.id)}>unequip</a></>)
}

function ConsumeItemLink(props) {
    const item = props.item
    if (!item.isConsumable()) return ''
    return (<> —  <a onclick={() => use(item.id)}>consume</a></>)
}

function DropItemLink(props) {
    const item = props.item
    return (<> — <a onclick={() => drop(item.id)}>drop</a></>)
}

function ItemCountIndicator(props) {
    if (props.count == 1) return ''
    return (<> ({props.count})</>)
}

export {
    EquipItemLink,
    UnequipItemLink,
    ConsumeItemLink,
    DropItemLink,
    ItemCountIndicator
}
