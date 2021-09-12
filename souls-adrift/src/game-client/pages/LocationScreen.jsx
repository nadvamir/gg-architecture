import { Link } from "solid-app-router";

import styles from "../../App.module.css";

import { GameEngine } from '../../game-engine/GameEngine.js'
import { GossipGraph } from '../../gossip-graph/GossipGraph.js'
import { infoModalController } from "../modals/InfoModalController";

let gossipGraph = new GossipGraph(42, 10, 100)
let gameEngine = new GameEngine(gossipGraph)
let state = gameEngine.getState()
let interactionState = gameEngine.getInteractionState()

function LocationScreen() {
  return (
    <div id={styles['location-screen']} class={[styles['main-screen'], styles['page']].join(' ')}>
      <div class={styles['content']}>
        <header>
          <div class={styles['status-bar']}>
            ❤ 20/20
            — <Link href="/character">Character</Link>
            &nbsp;— <Link href="/">Sign Out</Link>
          </div>
          <h1>Forlorn Quay</h1>
          <div class={styles['location-info']}>
            The wind blows freely over the empty quay. Rotten fishing nets lie here and there.
          </div>
        </header>
        <div class={styles['divider']}>
          Events
        </div>
        <section class={styles['location-info']}>
          <div>Rat dealt Leet Hax0r <b>2</b> damage.</div>
          <div>Leet Hax0r missed.</div>
          <div>Sailor Jerry entered.</div>
          <div>Sailor John left.</div>
        </section>
        <div class={styles['divider']}>
          Fight
        </div>
        <section>
          <div class={styles['item']}>Mouse 50% — <Link href="/attack/:sailor">attack</Link> (20%)</div>
        </section>
        <div class={styles['divider']}>
          Location
        </div>
        <section>
          <div class={styles['item']}>[1] <a href="#" onclick={() => infoModalController.showInfo('player', 15)}>Leet Hax0r</a> 90% — <Link href="/attack/:sailor">attack</Link> — fighting Rat</div>
          <div class={styles['item']}><a href="#" onclick={() => infoModalController.showInfo('npc', 15)}>Sailor Jerry</a> — <Link href="/npc">talk</Link> — <Link href="/attack/:sailor">attack</Link></div>
          <div class={styles['item']}><a href="#" onclick={() => infoModalController.showInfo('npc', 15)}>Rat</a> 73% — <Link href="/attack/:sailor">attack</Link> — fighting Leet Hax0r</div>
          <div class={styles['item']}><a href="#" onclick={() => infoModalController.showInfo('item', 15)}>Rotten fishing net</a> — <Link href="/attack/:sailor">pick up</Link></div>
        </section>
        <div class={styles['divider']}>
          Direction
        </div>
        <section>
          <div class={styles['item']}><Link href="/go/:north">Main street</Link>&nbsp;!</div>
          <div class={styles['item']}><Link href="/go/:south">Towards a sunken boat</Link></div>
          <div class={styles['item']}><Link href="/go/:south">Fourth wall library</Link>&nbsp;!</div>
          <div class={styles['item']}>Old house (locked)</div>
        </section>
        <div class={styles['divider']}>
          Speak
        </div>
        <div id={styles['message-box']}>
          <textarea rows='3'></textarea>
          <button>➳</button>
        </div>
        <div class={styles['divider']}>
          Temp
        </div>
        <section class={styles.header}>
          {state.messages.map(m => { return (<p>{m}</p>) })}
          <p>Sending: {interactionState.sending ? 'Yes' : 'No'}</p>
          <p><a class={styles.link} href="#" onClick={() => interactionState.sending || gameEngine.send(Math.random().toString())}>Send Message</a></p>
        </section>
      </div>
    </div>
  );
}

export default LocationScreen;