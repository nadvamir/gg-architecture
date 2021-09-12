import { Link } from "solid-app-router";

import styles from "../../App.module.css";

import { infoModalController } from "../modals/InfoModalController.js"

function NpcScreen() {
  return (
    <div id={styles['npc-screen']} class={[styles['main-screen'], styles['page']].join(' ')}>
      <div class={styles['content']}>
        <header>
          <div class={styles['status-bar']}>
            ❤ 20/20
            — <Link href="/location">Location</Link>
            &nbsp;— <Link href="/">Sign Out</Link>
          </div>
          <h1>Sailor Jerry</h1>
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
        <div class={styles['divider']}>
          Buy
        </div>
        <div>
          <div class={styles['item']}><a href="#" onclick={() => infoModalController.showInfo('item', 15)}>Leather gloves</a> (2) — <Link href="/buy">buy</Link> — £27</div>
        </div>
        <div class={styles['divider']}>
          Sell 
        </div>
          <div class={styles['item']}><a href="#" onclick={() => infoModalController.showInfo('item', 15)}>Leather gloves</a> — <Link href="/sell">sell</Link> — £20</div>
        <div>
        </div>
      </div>
    </div>
  );
}

export default NpcScreen;
