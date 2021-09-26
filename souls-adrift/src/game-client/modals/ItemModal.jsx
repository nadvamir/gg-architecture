import styles from "../../App.module.css";

import { SkillList } from "../items/SkillList.jsx"
import { capitalise, empty } from "../util/Util.js";

function ItemModal(props) {
  const item = () => props.item

  return (
    <>
      <h1>{item().name()}</h1>
      <p>{item().description()}</p>
      <div>
        <div class={styles['item']}>{capitalise(item().type())}</div>
        <div class={styles['item']}>Value: {item().value()}</div>
        {item().maxDmg() > 0 ? <div class={styles['item']}>Damage: {item().minDmg()}–{item().maxDmg()}</div> : ''}
        {item().armour() > 0 ? <div class={styles['item']}>Armour: {item().armour()}</div> : ''}
        {item().health() > 0 ? <div class={styles['item']}>Health: {item().health()}</div> : ''}
        {!empty(item().skills()) ? <><p></p><h2>Requires:</h2><SkillList skills={item().skills()} /></> : ''}
      </div>
    </>
  );
}

export default ItemModal