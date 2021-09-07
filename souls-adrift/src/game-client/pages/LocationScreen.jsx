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
      <div class={styles.App}>
        <header class={styles.header}>
          {state.messages.map(m => { return (<p>{m}</p>)})}
          <p>Sending: {interactionState.sending ? 'Yes' : 'No'}</p>
          <p><a class={styles.link} href="#" onClick={() => interactionState.sending || gameEngine.send(Math.random().toString())}>Send Message</a></p>
          <Link href="/chr">Character</Link>
          <Link href="/">Sign Out</Link>
        </header>
      </div>
  );
}

export default LocationScreen;