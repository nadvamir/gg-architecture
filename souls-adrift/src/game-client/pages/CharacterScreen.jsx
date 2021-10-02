import styles from "../../App.module.css";

import { EventsSection } from "../items/EventsSection.jsx"
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

function EquippedSection(props) {
  const player = props.player
  return (
    <Show when={player.equipment().length > 0}>
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
    </Show>
  )
}

function CharacterScreenImpl() {
  const state = gameEngine.getState()
  const player = gameEngine.get(state.uid)

  return (
    <div class={styles['content']}>
      <header>
        <StatusBar />
        <h1>[{player.level()}] __Blind_Augur__</h1>
        <div>
          Chapter 1: Soul Stranded
          </div>
        <div class={styles['location-info']}>
          <p>I was told that no ships will visit the harbour until spring. I can't leave, and I'm running out of money.</p>
        </div>
      </header>
      <EventsSection messages={state.messages} location={player.location()} />
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
      <EquippedSection player={player} />
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
  );
}

function CharacterScreen() {
  const state = gameEngine.getState()

  return (
    <div id={styles['character-screen']} class={[styles['main-screen'], styles['page']].join(' ')}>
      <Show when={!state.uid} fallback={<CharacterScreenImpl />}>
        <div class={state.uid ? styles['hidden'] : styles['game-loading']}>
          <h1>Loading...</h1>
        </div>
      </Show>
    </div>
  );
}

export default CharacterScreen;
