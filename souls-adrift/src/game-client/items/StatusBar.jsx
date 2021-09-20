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
    const state = gameEngine.getState()
    const player = gameEngine.get(state.uid)
    function hp() {
        return player.hp()
    }
    function maxHp() {
        return player.maxHp()
    }

    return (
        <div class={styles['status-bar']}>
            ❤ {hp()}/{maxHp()} — {link()}
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