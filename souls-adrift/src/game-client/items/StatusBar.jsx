import { Link } from "solid-app-router";

import styles from "../../App.module.css";

import { gameEngine } from "../../game-engine/GameAssembly";

function StatusBar() {
    let state = gameEngine.getState()

    return (
        <Switch>
            <Match when={!!state.uid}>
                <div class={styles['status-bar']}>
                    ❤ {state.players[state.uid].stats.hp}/20
                — <Link href="/location">Location</Link>
                &nbsp;— <Link href="/">Sign Out</Link>
                </div>
            </Match>
            <Match when={!state.uid}>
                <></>
            </Match>
        </Switch>
    )
}

export default StatusBar