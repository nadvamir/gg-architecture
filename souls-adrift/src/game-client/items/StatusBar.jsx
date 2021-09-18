import { Link } from "solid-app-router";

import styles from "../../App.module.css";

import { gameEngine } from "../../game-engine/GameAssembly";

function StatusBar() {
    let state = gameEngine.getState()
    function hp() {
        return gameEngine.get(state.uid).hp()
    }

    return (
        <div class={styles['status-bar']}>
            ❤ {hp()}/20
            — <Link href="/location">Location</Link>
            &nbsp;— <Link href="/">Sign Out</Link>
        </div>
    )
}

export default StatusBar