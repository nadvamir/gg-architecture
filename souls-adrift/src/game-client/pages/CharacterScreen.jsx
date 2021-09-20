import { Link } from "solid-app-router";

import styles from "../../App.module.css";

import { infoModalController } from "../modals/InfoModalController.js"
import { StatusBar } from "../items/StatusBar.jsx"

import { gameEngine } from "../../game-engine/GameAssembly";
import { equip, unequip, use, drop } from "../../game-engine/GameActions";

function EquipItemLink(props) {
  const item = props.item
  if (!item.isEquippable()) return (<></>)
  if (!item.canEquip(props.skills)) return (<> — equip</>)
  return (<> —  <a href="#" onclick={() => equip(item.id)}>equip</a></>)
}

function ConsumeItemLink(props) {
  const item = props.item
  if (!item.isConsumable()) return (<></>)
  return (<> —  <a href="#" onclick={() => use(item.id)}>consume</a></>)
}

function ItemCountIndicator(props) {
  if (props.count == 1) return (<></>)
  return (<> ({props.count})</>)
}

function CharacterScreen() {
  const state = gameEngine.getState()
  const player = gameEngine.get(state.uid)

  return (
    <div id={styles['character-screen']} class={[styles['main-screen'], styles['page']].join(' ')}>
      <div class={styles['content']}>
        <header>
          <StatusBar/>
          <h1>[1] __Blind_Augur__</h1>
          <div>
            Chapter 1: Soul Stranded
          </div>
          <div class={styles['location-info']}>
            <p>I was told that no ships will visit the harbour until spring. I can't leave, and I'm running out of money.</p>
          </div>
        </header>
        <div class={styles['divider']}>
          Character
        </div>
        <div>
          <div class={styles['item']}>Experiece: {player.exp()}/{player.maxExp()}</div>
          <div class={styles['item']}>Skill points: {player.skillPoints()}</div>
          <div class={styles['item']}>Damage: {player.minDmg()}–{player.maxDmg()}</div>
          <div class={styles['item']}>Armour: {player.armour()}</div>
        </div>
        <div class={styles['divider']}>
          Skills
        </div>
        <div>
          {Object.entries(player.skills()).map(([k, v]) => {
            return <div class={styles['item']}>{k[0].toUpperCase() + k.slice(1)}: {v}</div>
          })}
        </div>
        <div class={styles['divider']}>
          Equipped
        </div>
        <div>
          {player.equipment().map(item => {
            return <div class={styles['item']}><a href="#" onclick={() => infoModalController.showInfo('item', item.id)}>{item.name()}</a> — <a href="#" onclick={() => unequip(item.id)}>unequip</a> — <a href="#" onclick={() => drop(item.id)}>drop</a></div>
          })}
        </div>
        <div class={styles['divider']}>
          Items
        </div>
        <div>
          {player.inventory().map(([item, count]) => {
            return <div class={styles['item']}>
              <a href="#" onclick={() => infoModalController.showInfo('item', item.id)}>{item.name()}</a>
              <EquipItemLink item={item} skills={player.skills()} />
              <ConsumeItemLink item={item} />
              &nbsp;— <a href="#" onclick={() => drop(item.id)}>drop</a>
              <ItemCountIndicator count={count} />
            </div>
          })}
        </div>
      </div>
    </div>
  );
}

export default CharacterScreen;
