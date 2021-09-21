import { lazy } from "solid-js";
import { Routes, Route } from "solid-app-router";

import InfoModal from "./game-client/modals/InfoModal.jsx"
import styles from "./App.module.css";

import NpcData from "./game-client/data/[npc].data.js"

import { gameEngine } from "./game-engine/GameAssembly";

let state = gameEngine.getState()
let interactionState = gameEngine.getInteractionState()

const CharacterScreen = lazy(() => import("./game-client/pages/CharacterScreen.jsx"))
const LocationScreen = lazy(() => import("./game-client/pages/LocationScreen.jsx"))
const LoginScreen = lazy(() => import("./game-client/pages/LoginScreen.jsx"))
const NpcScreen = lazy(() => import("./game-client/pages/NpcScreen.jsx"))
const RegisterScreen = lazy(() => import("./game-client/pages/RegisterScreen.jsx"))

function App() {
  return (
    <div class={interactionState.sending ? styles.sending : 'normal'}>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/location" element={<LocationScreen />} />
        <Route path="/character" element={<CharacterScreen />} />
        <Route path="/npc/:id" element={<NpcScreen />} data={NpcData}/>
        <Route path="/register" element={<RegisterScreen />} />
      </Routes>
      <InfoModal/>
    </div>
  );
}

export default App;
