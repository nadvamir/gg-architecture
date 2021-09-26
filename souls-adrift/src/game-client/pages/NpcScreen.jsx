import { Link, useData } from "solid-app-router";

import styles from "../../App.module.css";

import { StatusBar } from "../items/StatusBar.jsx"
import { InfoModalLink } from "../items/InfoModalLink.jsx"
import {
  ItemCountIndicator,
  ItemCostIndicator,
  BuyItemLink,
  SellItemLink
} from "../items/ItemWidgets.jsx"

function ItemsForSale(props) {
  const npc = props.npc
  const player = props.player
  const items = npc.forSale()
  return (
    <Show when={items.length > 0}>
        <div class={styles['divider']}>
          Buy (you have £{player.moneyCount()})
        </div>
        <div>
          {items.map(([item, count]) => {
            return (<div class={styles['item']}>
              <InfoModalLink actor={item} />
              <ItemCountIndicator count={count} />
              <BuyItemLink item={item} player={player} cost={npc.bidPrice(item, player)} />
              <ItemCostIndicator cost={npc.bidPrice(item, player)} />
              </div>)
          })}
        </div>
    </Show>
  )
}

function ItemsToSell(props) {
  const npc = props.npc
  const player = props.player
  const items = npc.willBuy(player.inventory())
  return (
    <Show when={items.length > 0}>
        <div class={styles['divider']}>
          Sell (trader has £{npc.moneyCount()})
        </div>
        <div>
          {items.map(([item, count]) => {
            return (<div class={styles['item']}>
              <InfoModalLink actor={item} />
              <ItemCountIndicator count={count} />
              <SellItemLink item={item} npc={npc} cost={npc.askPrice(item, player)} />
              <ItemCostIndicator cost={npc.askPrice(item, player)} />
              </div>)
          })}
        </div>
    </Show>
  )
}

function NpcScreen() {
  const {npc, player} = useData()()

  return (
    <div id={styles['npc-screen']} class={[styles['main-screen'], styles['page']].join(' ')}>
      <div class={styles['content']}>
        <header>
          <StatusBar/>
          <h1>{npc.name()}</h1>
          <div class={styles['location-info']}>
            Hey, what brings you here?
          </div>
        </header>
        <div class={styles['divider']}>
          Dialog
        </div>
        <div>
          <div class={styles['item']}><Link href="/inspect/:sailor">I'm looking for work</Link></div>
          <div class={styles['item']}><Link href="/inspect/:sailor">I believe you lost something</Link> (give Amulet)</div>
          <div class={styles['item']}><Link href="/location">Just passing by</Link> (end)</div>
        </div>
        <ItemsForSale npc={npc} player={player} />
        <ItemsToSell npc={npc} player={player} />
      </div>
    </div>
  );
}

export default NpcScreen;
