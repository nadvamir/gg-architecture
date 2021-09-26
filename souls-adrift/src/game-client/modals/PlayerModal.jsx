import styles from "../../App.module.css";

import { InfoModalLink } from "../items/InfoModalLink.jsx"
import { empty } from "../util/Util";

function PlayerModal(props) {
  const player = () => props.player
  return (
    <>
      <h1>[{player().level()}] {player().name()}</h1>
      <p>{player().description()}</p>
      {!empty(player().equipment()) ? <>
        <h2>Equipped</h2>
        <div>
          {player().equipment().map(item => {
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

export default PlayerModal