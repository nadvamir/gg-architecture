import { createSignal } from 'solid-js';

import styles from "../../App.module.css";

import { infoModalController } from "./InfoModalController.js"
import { capitalise } from "../util/Util";

function CountInputForm(props) {
  let inputRef;

  const action = () => {
    const count = parseInt(inputRef.value, 10) || 1
    props.callback(count)
    infoModalController.hide()
  }

  return (
    <div class={styles['modal-input']}>
      <input type="number" value={props.max} ref={inputRef} />
      <button onclick={action}>OK</button>
    </div>
  )
}

function CountSelectorModal(props) {
  const callback = () => props.callback

  return (
    <>
      <h1>{capitalise(callback().text)} {callback().item.name()}</h1>
      <CountInputForm callback={callback().callback} max={callback().max} />
    </>
  );
}

export default CountSelectorModal