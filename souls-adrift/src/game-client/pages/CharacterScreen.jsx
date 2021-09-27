import styles from "../../App.module.css";

import { StatusBar } from "../items/StatusBar.jsx"
import { InfoModalLink } from "../items/InfoModalLink.jsx"
import { SkillList } from "../items/SkillList.jsx"
import {
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
          <div class={styles['item']}>Attack points: {player.attackPoints()}</div>
        </div>
        <div class={styles['divider']}>
          Skills
        </div>
        <SkillList skills={player.skills()} />
        <div class={styles['divider']}>
          Equipped
        </div>
        <div>
          {player.equipment().map(item => {
            return <div class={styles['item']}>
              <InfoModalLink actor={item} />
              <UnequipItemLink item={item} />
              <DropItemLink item={item} count={1} />
            </div>
          })}
        </div>
        <div class={styles['divider']}>
          Items
        </div>
        <div>
          {player.inventory().map(([item, count]) => {
            return <div class={styles['item']}>
              <InfoModalLink actor={item} />
              <ItemCountIndicator count={count} />
              <EquipItemLink item={item} skills={player.skills()} />
              <ConsumeItemLink item={item} />
              <DropItemLink item={item} count={count} />
            </div>
          })}
        </div>
      </div>
    </div>
  );
}

export default CharacterScreen;
