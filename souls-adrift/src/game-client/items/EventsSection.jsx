import styles from "../../App.module.css";

function EventsSection(props) {
    const messages = props.messages
    return (
        <Show when={messages.length > 0}>
            <div class={styles['divider']}>Events</div>
            <section class={styles['location-info']}>
                {[...messages]
                    .map(([d, m]) => { return (<div>{d.toLocaleTimeString()} — {m}</div>) })}
            </section>
        </Show>
    )
}

export { EventsSection }