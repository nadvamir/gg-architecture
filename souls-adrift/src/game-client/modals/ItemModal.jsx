import styles from "../../App.module.css";

import { infoModalController } from "./InfoModalController.js"

function ItemModal(props) {
  const item = props.item

  return (
    <>
      <h1>Shank {item.name()}</h1>
      <p>{item.description()}</p>
      <div>
        <div class={styles['item']}>Damage: 2–4</div>
        <div class={styles['item']}>Skill: 1</div>
      </div>
    </>
  );
}

export default ItemModal