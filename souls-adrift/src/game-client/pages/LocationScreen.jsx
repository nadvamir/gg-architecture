import { Link } from "solid-app-router";

import styles from "../../App.module.css";
import { LocationStatusBar } from "../items/StatusBar.jsx"

import { infoModalController } from "../modals/InfoModalController";
import { gameEngine } from "../../game-engine/GameAssembly";
import { attack, pickUp, goTo } from "../../game-engine/GameActions";

function LocationScreen() {
  const state = gameEngine.getState()
  const interactionState = gameEngine.getInteractionState()
  const player = gameEngine.get(state.uid)

  return (
    <div id={styles['location-screen']} class={[styles['main-screen'], styles['page']].join(' ')}>
      <Switch>
        <Match when={!!state.uid}>
          <div class={styles['content']}>
            <header>
              <LocationStatusBar />
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
              <div class={styles['item']}>Mouse 50% — <a href="#" onclick={() => attack(4)}>attack</a> (20%)</div>
            </section>
            <div class={styles['divider']}>
              Location
        </div>
            <section>
              <div class={styles['item']}>[1] <a href="#" onclick={() => infoModalController.showInfo('player', 15)}>Leet Hax0r</a> 90% — <a href="#" onclick={() => attack(1)}>attack</a> — fighting Rat</div>
              <div class={styles['item']}><a href="#" onclick={() => infoModalController.showInfo('npc', 15)}>Sailor Jerry</a> — <Link href="/npc">talk</Link> — <a href="#" onclick={() => attack(2)}>attack</a></div>
              <div class={styles['item']}><a href="#" onclick={() => infoModalController.showInfo('npc', 15)}>Rat</a> 73% — <a href="#" onclick={() => attack(3)}>attack</a> — fighting Leet Hax0r</div>
              <div class={styles['item']}><a href="#" onclick={() => infoModalController.showInfo('item', 15)}>Rotten fishing net</a> — <a href="#" onclick={() => pickUp(5)}>pick up</a></div>
            </section>
            <div class={styles['divider']}>
              Direction
        </div>
            <section>
              <div class={styles['item']}><a href="#" onclick={() => goTo(10)}>Main street</a>&nbsp;!</div>
              <div class={styles['item']}><a href="#" onclick={() => goTo(11)}>Towards a sunken boat</a></div>
              <div class={styles['item']}><a href="#" onclick={() => goTo(12)}>Fourth wall library</a>&nbsp;!</div>
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
        </Match>
        <Match when={!state.uid}>
          <div class={state.uid ? styles['hidden'] : styles['game-loading']}>
            <h1>Loading...</h1>
          </div>
        </Match>
      </Switch>
    </div>
  );
}

export default LocationScreen;