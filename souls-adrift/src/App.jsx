import { lazy } from "solid-js";
import { Routes, Route } from "solid-app-router";

const CharacterScreen = lazy(() => import("./game-client/pages/CharacterScreen.jsx"))
const LocationScreen = lazy(() => import("./game-client/pages/LocationScreen.jsx"))
const LoginScreen = lazy(() => import("./game-client/pages/LoginScreen.jsx"))
const RegisterScreen = lazy(() => import("./game-client/pages/RegisterScreen.jsx"))

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/loc" element={<LocationScreen />} />
        <Route path="/chr" element={<CharacterScreen />} />
        <Route path="/reg" element={<RegisterScreen />} />
      </Routes>
    </>
  );
}

export default App;
