import { Link, useNavigate } from "solid-app-router";
import { createSignal } from "solid-js";
import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';

import styles from "../../App.module.css";

import { gossipGraph } from "../../game-engine/GameAssembly";

function LoginScreen() {
  const [error, setError] = createSignal('')

  let emailRef;
  let passwordRef;

  const navigate = useNavigate()
  function signIn() {
    fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', },
      body: JSON.stringify({
        email: emailRef.value,
        password: Base64.stringify(sha256(passwordRef.value))
      }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.uid) {
          gossipGraph.init(data.uid, WebSocket, SimplePeer)
          navigate("/location")
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
        <p>A text-based adventure.</p>
      </header>
      <div class={styles['large-form']}>
        <Show when={error().length > 0}>
          <p class={styles['error']}>{error()}</p>
        </Show>
        <label for="email">Email</label>
        <input type="email" id="email" name="email" ref={emailRef} />
        <label for="username">Password</label>
        <input type="password" id="password" name="password" ref={passwordRef} />
        <button id="login-button" onClick={signIn}>Log In</button>
      </div>
      <Link href="/register">Register</Link>
    </div>
  );
}

export default LoginScreen;
