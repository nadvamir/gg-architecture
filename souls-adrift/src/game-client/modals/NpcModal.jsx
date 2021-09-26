import styles from "../../App.module.css";

import { InfoModalLink } from "../items/InfoModalLink.jsx"
import { empty } from "../util/Util";

function NpcModal(props) {
  const npc = () => props.npc

  return (
    <>
      <h1>{npc().name()}</h1>
      <p>{npc().description()}</p>
      {!empty(npc().equipment()) ? <>
        <h2>Equipped</h2>
        <div>
          {npc().equipment().map(item => {
            return <div class={styles['item']}>
              <InfoModalLink actor={item} />
            </div>
          })}
        </div>
      </>
        : ''}
    </>
  );
}

export default NpcModal