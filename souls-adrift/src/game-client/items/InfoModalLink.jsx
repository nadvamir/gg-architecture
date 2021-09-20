import { infoModalController } from "../modals/InfoModalController.js"

function InfoModalLink(props) {
    const actor = props.actor
    return (<a onclick={() => infoModalController.showInfo('item', actor.id)}>{actor.name()}</a>)
}

export { InfoModalLink }