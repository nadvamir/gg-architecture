import { Link, useNavigate } from "solid-app-router";

import styles from "../../App.module.css";

function LoginScreen() {
  const navigate = useNavigate()
  function signIn() {
    navigate("/location")
  }

  return (
    <div id={styles['login-screen']} class={[styles['main-screen'], styles['page']].join(' ')}>
      <header>
        <h1>Souls Adrift</h1>
        <p>A text-based adventure.</p>
      </header>
      <div class={styles['large-form']}>
        <label for="username">Username</label>
        <input type="text" id="username" name="username" />
        <label for="username">Password</label>
        <input type="password" id="password" name="password" />
        <button id="login-button" onClick={signIn}>Log In</button>
      </div>
      <Link href="/register">Register</Link>
    </div>
  );
}

export default LoginScreen;
