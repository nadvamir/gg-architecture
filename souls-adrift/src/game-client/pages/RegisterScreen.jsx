import { Link, useNavigate } from "solid-app-router";
import { createSignal } from "solid-js";
import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';

import styles from "../../App.module.css";

function RegisterScreen() {
  const [error, setError] = createSignal('')
  let usernameRef;
  let passwordRef;
  let emailRef;

  const navigate = useNavigate()

  const register = () => {
    fetch('http://localhost:3001/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', },
      body: JSON.stringify({
        username: usernameRef.value,
        email: emailRef.value,
        password: Base64.stringify(sha256(passwordRef.value))
      }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        navigate("/")
      }
      else {
        setError(data.error)
      }
    })
  }

  return (
    <div id={styles['login-screen']} class={[styles['main-screen'], styles['page']].join(' ')}>
      <header>
        <h1>Souls Adrift</h1>
        <p>Create a new account:</p>
      </header>
      <div class={styles['large-form']}>
        <Show when={error().length > 0}>
          <p class={styles['error']}>{error()}</p>
        </Show>
        <label for="email">Email</label>
        <input type="text" id="email" name="email" ref={emailRef} />
        <label for="username">Password</label>
        <input type="password" id="password" name="password" ref={passwordRef} />
        <label for="username">Username</label>
        <input type="text" id="username" name="username" ref={usernameRef} />
        <button id="register-button" onclick={register}>Register</button>
      </div>
      <Link href="/">Back to main</Link>
    </div>
  );
}

export default RegisterScreen;