import { Link } from "solid-app-router";

import styles from "../../App.module.css";

import { GameEngine } from '../../game-engine/GameEngine.js'
import { GossipGraph } from '../../gossip-graph/GossipGraph.js'

let gossipGraph = new GossipGraph(42, 10, 100)
let gameEngine = new GameEngine(gossipGraph)
let state = gameEngine.getState()
let interactionState = gameEngine.getInteractionState()

function LocationScreen() {
  return (
    <div id={styles['location-screen']} class={styles['main-screen']}>
      <div class={styles['content']}>
        <header>
          <div class={styles['status-bar']}>
            ❤ 20/20
            — <Link href="/chr">Character</Link>
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
        <div class={styles['location-info']}>
          <div>Rat dealt Leet Hax0r <b>2</b> damage.</div>
          <div>Leet Hax0r missed.</div>
          <div>Sailor Jerry entered.</div>
          <div>Sailor John left.</div>
        </div>
        <div class={styles['divider']}>
          Fight
        </div>
        <div>
          <div class={styles['item']}>Mouse 50% — <Link href="/attack/:sailor">attack</Link> (20%)</div>
        </div>
        <div class={styles['divider']}>
          Location
        </div>
        <div>
          <div class={styles['item']}>[1] <Link href="/inspect/:sailor">Leet Hax0r</Link> 90% — <Link href="/attack/:sailor">attack</Link> — fighting Rat</div>
          <div class={styles['item']}><Link href="/inspect/:sailor">Sailor Jerry</Link> — <Link href="/attack/:sailor">attack</Link></div>
          <div class={styles['item']}><Link href="/inspect/:sailor">Rat</Link> 73% — <Link href="/attack/:sailor">attack</Link> — fighting Leet Hax0r</div>
          <div class={styles['item']}><Link href="/inspect/:sailor">Rotten fishing net</Link></div>
        </div>
        <div class={styles['divider']}>
          Direction
        </div>
        <div>
          <div class={styles['item']}><Link href="/go/:north">Main street</Link> !</div>
          <div class={styles['item']}><Link href="/go/:south">Towards a sunken boat</Link></div>
        </div>
        <div class={styles['divider']}>
          Temp
        </div>
        <div class={styles.header}>
          {state.messages.map(m => { return (<p>{m}</p>) })}
          <p>Sending: {interactionState.sending ? 'Yes' : 'No'}</p>
          <p><a class={styles.link} href="#" onClick={() => interactionState.sending || gameEngine.send(Math.random().toString())}>Send Message</a></p>
        </div>
      </div>
    </div>
  );
}

export default LocationScreen;