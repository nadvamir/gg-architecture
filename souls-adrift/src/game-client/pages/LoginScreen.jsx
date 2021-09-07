import { Link, useNavigate } from "solid-app-router";

import appStyles from "../../App.module.css";

function LoginScreen() {
  const navigate = useNavigate()
  function signIn() {
    navigate("/loc")
  }

  return (
    <div id="login-screen" class={appStyles['main-screen']}>
      <header>
        <h1>Souls Adrift</h1>
        <p>A text-based adventure.</p>
      </header>
      <section class={appStyles['large-form']}>
        <label for="username">Username</label>
        <input type="text" id="username" name="username" />
        <button id="login-button" onClick={signIn}>Log In</button>
      </section>
      <Link href="/reg">Register</Link>
    </div>
  );
}

export default LoginScreen;
