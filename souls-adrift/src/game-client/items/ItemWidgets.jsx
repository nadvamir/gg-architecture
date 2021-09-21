import { equip, unequip, use, drop, buy, sell } from "../../game-engine/GameActions";

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

function ItemCostIndicator(props) {
    return (<> — £{props.cost}</>)
}

function BuyItemLink(props) {
    if (!props.player.canAfford(props.cost)) return (<> — buy</>)
    return (<> — <a onclick={() => buy(props.item.id)}>buy</a></>)
}

function SellItemLink(props) {
    if (!props.npc.canAfford(props.cost)) return (<> — sell</>)
    return (<> — <a onclick={() => sell(props.item.id)}>sell</a></>)
}

export {
    EquipItemLink,
    UnequipItemLink,
    ConsumeItemLink,
    DropItemLink,
    ItemCountIndicator,
    ItemCostIndicator,
    BuyItemLink,
    SellItemLink
}
