import { Switch, Match } from "solid-js/web";

import styles from "../../App.module.css";

import { infoModalController } from "./InfoModalController.js"
import ItemModal from "./ItemModal.jsx"
import PlayerModal from "./PlayerModal.jsx"
import NpcModal from "./NpcModal.jsx"

function InfoModal() {
  const matches = (type) => infoModalController.state.actor.constructor.name === type
  return (
    <div class={infoModalController.state.open ? '' : styles.hidden}>
      <div class={styles['grey-overlay']} onClick={() => infoModalController.hide()}>
      </div>
      <div id={styles['info-modal']} class={styles['page']}>
        <div class={styles['content']}>
          <div id={styles['modal-close']} onClick={() => infoModalController.hide()}>×</div>
          <Switch>
            <Match when={matches("Player")}>
              <PlayerModal player={infoModalController.state.actor}/>
            </Match>
            <Match when={matches("Item")}>
              <ItemModal item={infoModalController.state.actor}/>
            </Match>
            <Match when={matches("Npc")}>
              <NpcModal npc={infoModalController.state.actor}/>
            </Match>
          </Switch>
        </div>
      </div>
    </div>
  );
}

export default InfoModal;
