import styles from "../../App.module.css";

import { infoModalController } from "./InfoModalController.js"

function NpcModal() {
  return (
    <>
      <h1>Sailor Jerry</h1>
      <p>A man of unspecified age.</p>
      <h2>Equipped</h2>
      <div>
        <div class={styles['item']}><a href="#" onclick={() => infoModalController.showInfo('item', 9)}>Bowie knife</a></div>
        <div class={styles['item']}><a href="#" onclick={() => infoModalController.showInfo('item', 8)}>Leather boots</a></div>
        <div class={styles['item']}><a href="#" onclick={() => infoModalController.showInfo('item', 8)}>Sturdy jacket</a></div>
        <div class={styles['item']}><a href="#" onclick={() => infoModalController.showInfo('item', 8)}>Leather gloves</a></div>
      </div>
    </>
  );
}

export default NpcModal