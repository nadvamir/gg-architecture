import { Link } from "solid-app-router";

import styles from "../../App.module.css";

import { infoModalController } from "../modals/InfoModalController.js"

function CharacterScreen() {
  return (
    <div id={styles['character-screen']} class={[styles['main-screen'], styles['page']].join(' ')}>
      <div class={styles['content']}>
        <header>
          <div class={styles['status-bar']}>
            ❤ 20/20
            — <Link href="/location">Location</Link>
            &nbsp;— <Link href="/">Sign Out</Link>
          </div>
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
          <div class={styles['item']}>Experiece: 100/240</div>
          <div class={styles['item']}>Skill points: 1</div>
          <div class={styles['item']}>Damage: 2–8</div>
          <div class={styles['item']}>Armour: 1</div>
        </div>
        <div class={styles['divider']}>
          Skills
        </div>
        <div>
          <div class={styles['item']}>Strength: 3</div>
          <div class={styles['item']}>Dexterity: 2</div>
          <div class={styles['item']}>Sabre: 0</div>
        </div>
        <div class={styles['divider']}>
          Equipped 
        </div>
          <div class={styles['item']}><a href="#" onclick={() => infoModalController.showInfo('item', 12)}>Leather gloves</a> — <Link href="/attack/:sailor">unequip</Link> — <Link href="/attack/:sailor">drop</Link></div>
        <div>
        </div>
        <div class={styles['divider']}>
          Items
        </div>
        <div>
          <div class={styles['item']}><a href="#" onclick={() => infoModalController.showInfo('item', 10)}>Shank</a> — <Link href="/attack/:sailor">equip</Link> — <Link href="/attack/:sailor">drop</Link></div>
          <div class={styles['item']}><a href="#" onclick={() => infoModalController.showInfo('item', 11)}>Coin</a> (25) — <Link href="/attack/:sailor">drop</Link></div>
        </div>
      </div>
    </div>
  );
}

export default CharacterScreen;
