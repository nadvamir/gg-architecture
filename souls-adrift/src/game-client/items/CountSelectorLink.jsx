import { infoModalController } from "../modals/InfoModalController.js"

function CountSelectorLink(props) {
    const maxCount = props.max
    if (maxCount == 1) {
        return (<a onclick={() => props.callback(1)}>{props.text}</a>)
    }
    return (<a onclick={() => infoModalController.showCountSelector(props.callback, props.item, maxCount, props.text)}>{props.text}</a>)
}

export { CountSelectorLink }
