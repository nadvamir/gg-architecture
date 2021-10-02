import { Link } from "solid-app-router";

import styles from "../../App.module.css";
import { LocationStatusBar } from "../items/StatusBar.jsx"
import { ItemCountIndicator } from "../items/ItemWidgets.jsx"
import { InfoModalLink } from "../items/InfoModalLink.jsx"
import { CountSelectorLink } from "../items/CountSelectorLink.jsx"
import { EventsSection } from "../items/EventsSection.jsx"

import { gameEngine } from "../../game-engine/GameAssembly";
import { attack, pickUp, goTo, talk } from "../../game-engine/GameActions";

function battling(actor, target) {
  if (!actor.battleTarget) return false
  return actor.battleTarget()?.id == target.id
}

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
  const percent = () => Math.floor(actor.hp() / actor.maxHp() * 100)
  return (<Show when={percent() < 100}><Nbsp />{percent()}%</Show>)
}

function AttackSuccessStatus(props) {
  return (<><Nbsp />({props.player.attackSuccessChance(props.target)}%)</>)
}

function FightingStatus(props) {
  const targetName = () => !!props.actor.battleTarget && props.actor.battleTarget()?.name()
  return (<Show when={!!targetName()}>
    — fighting {targetName()}
  </Show>)
}

function LevelIndicator(props) {
  return (<Show when={!!props.actor.level}>
    <>[{props.actor.level()}] </>
  </Show>)
}

function BattleSection(props) {
  const attackers = (location) => {
    return location.actors()
      .map(([a, _]) => a)
      .filter(a => battling(a, props.player) || battling(props.player, a))
  }
  return (
    <Show when={attackers(props.location).length > 0}>
      <div class={styles['divider']}>Fight</div>
      <section>
        {attackers(props.location).map(a => {
          return (
            <div class={styles['item']}>
              <InfoModalLink actor={a} />
              <HpPercentStatus actor={a} />
              <AttackLink actor={a} />
              <AttackSuccessStatus player={props.player} target={a} />
            </div>
          )
        })}
      </section>
    </Show>
  )
}

function LocationSection(props) {
  const player = props.player
  const actors = () => props.location.actors().filter(([a, _]) => {
    return a.id != player.id && !battling(a, player) && !battling(player, a)
  })

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

function MessageBox(props) {
  let inputRef;
  const sendMessage = () => {
    talk(inputRef.value)
    inputRef.value = ''
  }

  return (
    <div>
      <div class={styles['divider']}>Speak</div>
      <div id={styles['message-box']}>
        <textarea rows='3' ref={inputRef}></textarea>
        <button onclick={sendMessage}>➳</button>
      </div>
    </div>
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
      <BattleSection player={player} location={location()} />
      <LocationSection player={player} location={location()} />
      <DirectionSection player={player} location={location()} />
      <MessageBox />
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