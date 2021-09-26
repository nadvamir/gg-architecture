import { infoModalController } from "../modals/InfoModalController.js"

function InfoModalLink(props) {
    const actor = props.actor
    return (<a onclick={() => infoModalController.showInfo(actor)}>{actor.name()}</a>)
}

export { InfoModalLink }