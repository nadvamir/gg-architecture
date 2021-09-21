import { createResource } from "solid-js"

import { gameEngine } from "../../game-engine/GameAssembly";

export default function NpcData({params, location, navigate}) {
    const [npc] = createResource(() => params.id, (id) => {
        return {
            npc: gameEngine.get(id),
            player: gameEngine.get(gameEngine.getState().uid)
        }
    })
    return npc
}