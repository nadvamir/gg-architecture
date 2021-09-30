import { Link } from "solid-app-router";

import styles from "../../App.module.css";
import { LocationStatusBar } from "../items/StatusBar.jsx"
import { ItemCountIndicator } from "../items/ItemWidgets.jsx"
import { InfoModalLink } from "../items/InfoModalLink.jsx"
import { CountSelectorLink } from "../items/CountSelectorLink.jsx"

import { gameEngine } from "../../game-engine/GameAssembly";
import { attack, pickUp, goTo } from "../../game-engine/GameActions";

function Nbsp() {
  return '\u00A0'
}

function TalkLink(props) {
  const actor = props.actor
  if (!actor.type || actor.type() != 'npc.talk') return ''
  return (<> — <Link href={"/npc/" + actor.id}>talk</Link></>)
}

function AttackLink(props) {
  const actor = props.actor
  if (!actor.hp) return ''
  return (<> — <a onclick={() => attack(actor.id)}>attack</a></>)
}

function PickUpLink(props) {
  const actor = props.actor
  if (actor.constructor.name != 'Item') return ''
  return (<> — <CountSelectorLink callback={(count) => pickUp(props.actor.id, count)} text='pick up' max={props.count} item={props.actor} /></>)
}

function HpPercentStatus(props) {
  const actor = props.actor
  if (!actor.hp) return ''
  const percent = Math.floor(actor.hp() / actor.maxHp() * 100)
  if (percent == 100) return ''
  return (<><Nbsp />{percent}%</>)
}

function AttackSuccessStatus(props) {
  return (<><Nbsp />({props.player.attackSuccessChance(props.target)}%)</>)
}

function FightingStatus(props) {
  const targetName = () => !!props.actor.battleTarget && props.actor.battleTarget()?.name()
  return (<Show when={!!targetName()} fallback={<></>}>
    — fighting {targetName()}
  </Show>)
}

function LevelIndicator(props) {
  return (<Show when={!!props.actor.level} fallback={<></>}>
    <>[{props.actor.level()}] </>
  </Show>)
}

function EventsSection(props) {
  const messages = props.messages
  return (
    <div class={messages.length == 0 ? styles['hidden'] : ''}>
      <div class={styles['divider']}>Events</div>
      <section class={styles['location-info']}>
        {messages.map(([d, m]) => { return (<div>{d.toLocaleTimeString()} — {m}</div>) })}
      </section>
    </div>
  )
}

function BattleSection(props) {
  return (
    <Show when={!!props.target} fallback={<></>}>
      <div class={styles['divider']}>Fight</div>
      <section>
        <div class={styles['item']}>
          <InfoModalLink actor={props.target} />
          <HpPercentStatus actor={props.target} />
          <AttackLink actor={props.target} />
          <AttackSuccessStatus player={props.player} target={props.target} />
        </div>
      </section>
    </Show>
  )
}

function LocationSection(props) {
  const player = props.player
  const actors = () => props.location.actors().filter(a => a[0].id != player.id && a[0].id != player.battleTarget())

  return (
    <Show when={actors().length > 0} fallback={<></>}>
      <div class={styles['divider']}>Location</div>
      <section>
        {actors().map(([actor, count]) => {
          return (<div class={styles['item']}>
            <LevelIndicator actor={actor} />
            <InfoModalLink actor={actor} />
            <ItemCountIndicator count={count} />
            <HpPercentStatus actor={actor} />
            <TalkLink actor={actor} />
            <AttackLink actor={actor} />
            <PickUpLink actor={actor} count={count} />
            <FightingStatus actor={actor} />
          </div>)
        })}
      </section>
    </Show>
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
  const moves = () => props.location.moves(props.player)
  return (
    <>
      <div class={styles['divider']}>Direction</div>
      <section>
        {moves().map(([loc, accessible]) => {
          return (<LocationItem location={loc} accessible={accessible} />)
        })}
      </section>
    </>
  )
}

function LocationScreenImpl() {
  const state = gameEngine.getState()
  const player = gameEngine.get(state.uid)
  const location = () => player.location()

  return (
    <div class={styles['content']}>
      <header>
        <LocationStatusBar />
        <h1>{location().name()}</h1>
        <div class={styles['location-info']}>{location().description()}</div>
      </header>
      <EventsSection messages={state.messages} location={location()} />
      <BattleSection player={player} target={player.battleTarget()} />
      <LocationSection player={player} location={location()} />
      <DirectionSection player={player} location={location()} />
      <div class={styles['divider']}>Speak</div>
      <div id={styles['message-box']}>
        <textarea rows='3'></textarea>
        <button>➳</button>
      </div>
    </div>
  );
}

function LocationScreen() {
  const state = gameEngine.getState()

  return (
    <div id={styles['location-screen']} class={[styles['main-screen'], styles['page']].join(' ')}>
      <Show when={!state.uid} fallback={<LocationScreenImpl />}>
        <div class={state.uid ? styles['hidden'] : styles['game-loading']}>
          <h1>Loading...</h1>
        </div>
      </Show>
    </div>
  );
}

export default LocationScreen;