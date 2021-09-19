import { Link } from "solid-app-router";

import styles from "../../App.module.css";

import { gameEngine } from "../../game-engine/GameAssembly";

function LinkLocation() {
    return (<Link href="/location">Location</Link>)
}

function LinkCharacter() {
    return (<Link href="/character">Character</Link>)
}

function StatusBarBase(link) {
    let state = gameEngine.getState()
    function hp() {
        return gameEngine.get(state.uid).hp()
    }
    function maxHp() {
        return gameEngine.get(state.uid).maxHp()
    }

    return (
        <div class={styles['status-bar']}>
            ❤ {hp()}/{maxHp()}
            — {link()}
            &nbsp;— <Link href="/">Sign Out</Link>
        </div>
    )
}

function StatusBar() {
    return StatusBarBase(LinkLocation)
}

function LocationStatusBar() {
    return StatusBarBase(LinkCharacter)
}

export {StatusBar, LocationStatusBar}