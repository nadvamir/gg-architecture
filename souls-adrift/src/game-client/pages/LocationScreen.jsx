import { Link } from "solid-app-router";

import styles from "../../App.module.css";
import { LocationStatusBar } from "../items/StatusBar.jsx"

import { gameEngine } from "../../game-engine/GameAssembly";
import { attack, pickUp, goTo } from "../../game-engine/GameActions";

import { InfoModalLink } from "../items/InfoModalLink.jsx"

function Nbsp() {
  return '\u00A0'
}

function TalkLink(props) {
  const actor = props.actor
  if (!actor.type || actor.type() != 'npc.talk') return ''
  //TODO: make /npc link contain npc ID
  return (<> — <Link href="/npc">talk</Link></>)
}

function AttackLink(props) {
  const actor = props.actor
  if (!actor.hp) return ''
  return (<> — <a onclick={() => attack(actor.id)}>attack</a></>)
}

function PickUpLink(props) {
  const actor = props.actor
  if (actor.constructor.name != 'Item') return ''
  return (<> — <a onclick={() => pickUp(actor.id)}>pick up</a></>)
}

function HpPercentStatus(props) {
  const actor = props.actor
  if (!actor.hp) return ''
  const percent = Math.floor(actor.hp() / actor.maxHp() * 100)
  if (percent == 100) return ''
  return (<><Nbsp />{percent}%</>)
}

function AttackSuccessStatus(props) {
  // TODO: calculate real status
  return (<><Nbsp />(%20)</>)
}

function FightingStatus(props) {
  const actor = props.actor
  if (!actor.battleTarget) return ''
  const target = actor.battleTarget()
  if (!target) return ''
  return ' fighting ' + target.name()
}

function LevelIndicator(props) {
  const actor = props.actor
  if (!actor.level) return ''
  return (<>[{actor.level()}] </>)
}

function EventsSection(props) {
  return (
    <>
      <div class={styles['divider']}>Events</div>
      <section class={styles['location-info']}>
        <div>Rat dealt Leet Hax0r <b>2</b> damage.</div>
        <div>Leet Hax0r missed.</div>
        <div>Sailor Jerry entered.</div>
        <div>Sailor John left.</div>
      </section>
    </>
  )
}

function BattleSection(props) {
  const target = props.player.battleTarget()
  if (!target) return (<></>)
  return (
    <>
      <div class={styles['divider']}>Fight</div>
      <section>
        <div class={styles['item']}>
          <InfoModalLink actor={target} />
          <HpPercentStatus actor={target} />
          <AttackLink actor={target} />
          <AttackSuccessStatus player={props.player} target={target} />
        </div>
      </section>
    </>
  )
}

function LocationSection(props) {
  const player = props.player
  const target = player.battleTarget()
  const targetId = target && target.id || 0
  const actors = props.location.actors().filter(a => a.id != player.id && a.id != targetId)

  if (!actors) return (<></>)
  return (
    <>
      <div class={styles['divider']}>Location</div>
      <section>
        {actors.map(actor => {
          return (<div class={styles['item']}>
            <LevelIndicator actor={actor} />
            <InfoModalLink actor={actor} />
            <HpPercentStatus actor={actor} />
            <TalkLink actor={actor} />
            <AttackLink actor={actor} />
            <PickUpLink actor={actor} />
            <FightingStatus actor={actor} />
          </div>)
        })}
      </section>
    </>
  )
}

function LocationItem(props) {
  const loc = props.location
  if (props.accessible) {
    return (<div class={styles['item']}>
      <a onclick={() => goTo(loc.id)}>{loc.name()}</a>
      {loc.noisy() ? ' !' : ''}
    </div>)
  }
  else {
    return (<div class={styles['item']}>
      {loc.name()} (locked)
      {loc.noisy() ? ' !' : ''}
    </div>)
  }
}

function DirectionSection(props) {
  const moves = props.location.moves(props.player)
  return (
    <>
      <div class={styles['divider']}>Direction</div>
      <section>
        {moves.map(([loc, accessible]) => {
          return (<LocationItem location={loc} accessible={accessible} />)
        })}
      </section>
    </>
  )
}

function LocationScreenImpl() {
  const state = gameEngine.getState()
  const interactionState = gameEngine.getInteractionState()
  const player = gameEngine.get(state.uid)
  const location = player.location()

  return (
    <div class={styles['content']}>
      <header>
        <LocationStatusBar />
        <h1>{location.name()}</h1>
        <div class={styles['location-info']}>{location.description()}</div>
      </header>
      <EventsSection location={location} />
      <BattleSection player={player} />
      <LocationSection player={player} location={location} />
      <DirectionSection player={player} location={location} />
      <div class={styles['divider']}>Speak</div>
      <div id={styles['message-box']}>
        <textarea rows='3'></textarea>
        <button>➳</button>
      </div>
      <div class={styles['divider']}>Temp</div>
      <section class={styles.header}>
        {state.messages.map(m => { return (<p>{m}</p>) })}
        <p>Sending: {interactionState.sending ? 'Yes' : 'No'}</p>
        <p><a class={styles.link} href="#" onClick={() => interactionState.sending || gameEngine.send(Math.random().toString())}>Send Message</a></p>
      </section>
    </div>
  );
}

function LocationScreen() {
  const state = gameEngine.getState()

  return (
    <div id={styles['location-screen']} class={[styles['main-screen'], styles['page']].join(' ')}>
      <Switch>
        <Match when={!!state.uid}>
          <LocationScreenImpl />
        </Match>
        <Match when={!state.uid}>
          <div class={state.uid ? styles['hidden'] : styles['game-loading']}>
            <h1>Loading...</h1>
          </div>
        </Match>
      </Switch>
    </div>
  );
}

export default LocationScreen;