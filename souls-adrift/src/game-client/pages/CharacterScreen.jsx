import { Link } from "solid-app-router";

import styles from "../../App.module.css";

import { infoModalController } from "../modals/InfoModalController.js"
import { StatusBar } from "../items/StatusBar.jsx"

import { gameEngine } from "../../game-engine/GameAssembly";
import { equip, unequip, use, drop } from "../../game-engine/GameActions";

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
        <div class={styles['item']}><a href="#" onclick={() => infoModalController.showInfo('item', 12)}>Leather gloves</a> — <a href="#" onclick={() => unequip(4)}>unequip</a> — <a href="#" onclick={() => drop(4)}>drop</a></div>
        <div>
        </div>
        <div class={styles['divider']}>
          Items
        </div>
        <div>
          <div class={styles['item']}><a href="#" onclick={() => infoModalController.showInfo('item', 10)}>Shank</a> — <a href="#" onclick={() => equip(4)}>equip</a> — <a href="#" onclick={() => drop(4)}>drop</a></div>
          <div class={styles['item']}><a href="#" onclick={() => infoModalController.showInfo('item', 10)}>Officer's sabre</a> — equip — <a href="#" onclick={() => drop(4)}>drop</a></div>
          <div class={styles['item']}><a href="#" onclick={() => infoModalController.showInfo('item', 10)}>Health potion</a> — <a href="#" onclick={() => use(4)}>consume</a></div>
          <div class={styles['item']}><a href="#" onclick={() => infoModalController.showInfo('item', 11)}>Coin</a> (25) — <a href="#" onclick={() => drop(4)}>drop</a></div>
        </div>
      </div>
    </div>
  );
}

export default CharacterScreen;
