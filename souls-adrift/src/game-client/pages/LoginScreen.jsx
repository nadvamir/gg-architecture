import { Link } from "solid-app-router";

function LoginScreen() {
  return (
    <div>
        <p>Login Screen</p>
        <Link href="/loc">Sign In</Link><br/>
        <Link href="/reg">Register</Link>
    </div>
  );
}

export default LoginScreen;
