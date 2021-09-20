import { Link } from "solid-app-router";

import styles from "../../App.module.css";

import { StatusBar } from "../items/StatusBar.jsx"
import {
  ItemInfoLink,
  EquipItemLink,
  UnequipItemLink,
  ConsumeItemLink,
  DropItemLink,
  ItemCountIndicator
} from "../items/ItemWidgets.jsx"

import { gameEngine } from "../../game-engine/GameAssembly";

function CharacterScreen() {
  const state = gameEngine.getState()
  const player = gameEngine.get(state.uid)

  return (
    <div id={styles['character-screen']} class={[styles['main-screen'], styles['page']].join(' ')}>
      <div class={styles['content']}>
        <header>
          <StatusBar />
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
            return <div class={styles['item']}>
              <ItemInfoLink item={item} />
              <UnequipItemLink item={item} />
              <DropItemLink item={item} />
            </div>
          })}
        </div>
        <div class={styles['divider']}>
          Items
        </div>
        <div>
          {player.inventory().map(([item, count]) => {
            return <div class={styles['item']}>
              <ItemInfoLink item={item} />
              <EquipItemLink item={item} skills={player.skills()} />
              <ConsumeItemLink item={item} />
              <DropItemLink item={item} />
              <ItemCountIndicator count={count} />
            </div>
          })}
        </div>
      </div>
    </div>
  );
}

export default CharacterScreen;
