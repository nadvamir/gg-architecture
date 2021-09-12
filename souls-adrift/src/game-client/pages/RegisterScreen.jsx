import { Link } from "solid-app-router";

import styles from "../../App.module.css";

function RegisterScreen() {
  return (
    <div id={styles['login-screen']} class={[styles['main-screen'], styles['page']].join(' ')}>
      <header>
        <h1>Souls Adrift</h1>
        <p>Create a new account:</p>
      </header>
      <div class={styles['large-form']}>
        <label for="username">Username</label>
        <input type="text" id="username" name="username" />
        <label for="username">Password</label>
        <input type="password" id="password" name="password" />
        <label for="username">Email</label>
        <input type="text" id="email" name="email" />
        <button id="register-button">Register</button>
      </div>
      <Link href="/">Back to main</Link>
    </div>
  );
}

export default RegisterScreen;