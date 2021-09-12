import styles from "../../App.module.css";

import { infoModalController } from "./InfoModalController.js"

function ItemModal() {
  function getItemName() {
    return infoModalController.state.item.id
  }

  return (
    <>
      <h1>Shank {getItemName}</h1>
      <p>A sharp rusty piece of metal tied to a wooden handle.</p>
      <div>
        <div class={styles['item']}>Damage: 2–4</div>
        <div class={styles['item']}>Skill: 1</div>
      </div>
    </>
  );
}

export default ItemModal