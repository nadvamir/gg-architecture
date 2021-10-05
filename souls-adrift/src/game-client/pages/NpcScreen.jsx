import { Link, useData, useNavigate } from "solid-app-router";
import { createSignal } from "solid-js";

import styles from "../../App.module.css";

import { gameEngine } from "../../game-engine/GameAssembly";
import { fulfillsConditions } from "../../game-engine/DialogueActions";
import { pickDialogue } from "../../game-engine/GameActions";

import { EventsSection } from "../items/EventsSection.jsx"
import { StatusBar } from "../items/StatusBar.jsx"
import { InfoModalLink } from "../items/InfoModalLink.jsx"
import {
  ItemCountIndicator,
  ItemCostIndicator,
  BuyItemLink,
  SellItemLink
} from "../items/ItemWidgets.jsx"

function ReplyOption(props) {
  const reply = props.reply

  return (
    <Show when={fulfillsConditions(props.player, props.npc, reply.c)}>
      <div class={styles['item']}>
        <a onclick={props.choose}>{reply.t}</a>
        <Show when={reply.l == '__end__'}> (end)</Show>
      </div>
    </Show>
  )
}

function DialogSection(props) {
  const navigate = useNavigate()
  const [dialogueState, setDialogueState] = createSignal('__init__')

  const npc = props.npc
  const player = props.player

  const dialogue = () => npc.getDialogue(dialogueState())

  const pick = (reply) => {
    return () => {
      if (reply.l == '__end__') {
        navigate('/location')
      }
      else {
        if (!!reply.a) {
          pickDialogue(npc.id, dialogueState(), reply.l)
        }
        setDialogueState(reply.l)
      }
    }
  }

  return (
    <>
      <div class={styles['divider']}>
        Said {npc.name()},
      </div>
      <div class={styles['location-info']}>{dialogue().t}</div>
      <div class={styles['divider']}>
        Dialog
      </div>
      <div>
        {dialogue().r.map(reply => {
          return (<ReplyOption reply={reply} npc={npc} player={player} choose={pick(reply)} />)
        })}
      </div>
    </>
  )
}

function ItemsForSale(props) {
  const npc = props.npc
  const player = props.player
  const items = () => npc.forSale()
  return (
    <Show when={items().length > 0}>
      <div class={styles['divider']}>
        Buy (you have £{player.moneyCount()})
      </div>
      <div>
        {items().map(([item, count]) => {
          return (<div class={styles['item']}>
            <InfoModalLink actor={item} />
            <ItemCountIndicator count={count} />
            <BuyItemLink item={item} player={player} cost={npc.askPrice(item, player)} count={count} npc={npc} />
            <ItemCostIndicator cost={npc.askPrice(item, player)} />
          </div>)
        })}
      </div>
    </Show>
  )
}

function ItemsToSell(props) {
  const npc = props.npc
  const player = props.player
  const items = () => npc.willBuy(player.inventory())
  return (
    <Show when={items().length > 0}>
      <div class={styles['divider']}>
        Sell (trader has £{npc.moneyCount()})
      </div>
      <div>
        {items().map(([item, count]) => {
          return (<div class={styles['item']}>
            <InfoModalLink actor={item} />
            <ItemCountIndicator count={count} />
            <SellItemLink item={item} npc={npc} cost={npc.bidPrice(item, player)} count={count} npc={npc} />
            <ItemCostIndicator cost={npc.bidPrice(item, player)} />
          </div>)
        })}
      </div>
    </Show>
  )
}

function NpcScreenImpl() {
  const { npc, player } = useData()()
  const state = npc.gameEngine.getState()
  const location = npc.location()

  return (
    <div class={styles['content']}>
      <header>
        <StatusBar />
        <h1>{npc.name()}</h1>
      </header>
      <EventsSection messages={state.messages} location={location} />
      <DialogSection npc={npc} player={player} />
      <ItemsForSale npc={npc} player={player} />
      <ItemsToSell npc={npc} player={player} />
    </div>
  );
}

function NpcScreen() {
  const state = gameEngine.getState()

  return (
    <div id={styles['npc-screen']} class={[styles['main-screen'], styles['page']].join(' ')}>
      <Show when={!state.uid} fallback={<NpcScreenImpl />}>
        <div class={state.uid ? styles['hidden'] : styles['game-loading']}>
          <h1>Loading...</h1>
        </div>
      </Show>
    </div>
  );
}


export default NpcScreen;
