import styles from "../../App.module.css";
import { capitalise } from "../util/Util.js";

function SkillList(props) {
  return (
    <div>
      {Object.entries(props.skills).map(([k, v]) => {
        return <div class={styles['item']}>{capitalise(k)}: {v}</div>
      })}
    </div>
  )
}

export { SkillList }