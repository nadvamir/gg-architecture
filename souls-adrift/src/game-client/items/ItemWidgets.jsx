import { CountSelectorLink } from "../items/CountSelectorLink.jsx"

import { equip, unequip, use, drop, buy, sell, takeFrom } from "../../game-engine/GameActions";

function EquipItemLink(props) {
    const item = props.item
    if (!item.isEquippable()) return ''
    return (
        <Show when={item.canEquip(props.skills)} fallback=' — equip'>
            <> —  <a onclick={() => equip(item.id)}>equip</a></>
        </Show>
    )
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
    return (<> — <CountSelectorLink callback={(count) => drop(item.id, count)} text='drop' max={props.count} item={item} /></>)
}

function ItemCountIndicator(props) {
    return (<Show when={props.count > 1}> ({props.count})</Show>)
}

function ItemCostIndicator(props) {
    return (<> — £{props.cost}</>)
}

function BuyItemLink(props) {
    return (
        <Show when={props.player.canAfford(props.cost)} fallback=' — buy'>
            <> — <CountSelectorLink callback={(count) => buy(props.item.id, count, props.npc.id)} text='buy' max={props.count} item={props.item} /></>
        </Show>
    )
}

function SellItemLink(props) {
    return (
        <Show when={props.npc.canAfford(props.cost)} fallback=' — sell'>
            <> — <CountSelectorLink callback={(count) => sell(props.item.id, count, props.npc.id)} text='sell' max={props.count} item={props.item} /></>
        </Show>
    )
}

function TakeItemFromLink(props) {
    const store = props.store
    const item = props.item
    return (<> — <CountSelectorLink callback={(count) => takeFrom(item.id, count, store.id)} text='take' max={props.count} item={item} /></>)
}

export {
    EquipItemLink,
    UnequipItemLink,
    ConsumeItemLink,
    DropItemLink,
    ItemCountIndicator,
    ItemCostIndicator,
    BuyItemLink,
    SellItemLink,
    TakeItemFromLink
}
