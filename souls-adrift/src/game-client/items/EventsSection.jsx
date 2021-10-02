import styles from "../../App.module.css";

function EventsSection(props) {
    const messages = props.messages
    return (
        <Show when={messages.length > 0}>
            <div class={styles['divider']}>Events</div>
            <section class={styles['location-info']}>
                {[...messages]
                    .sort(([d1, _1], [d2, _2]) => d2 - d1)
                    .map(([d, m]) => { return (<div>{d.toLocaleTimeString()} — {m}</div>) })}
            </section>
        </Show>
    )
}

export { EventsSection }