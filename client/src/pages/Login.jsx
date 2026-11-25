// Author: Grace Yuzwin, Shayne Lachapelle
import { Link, Navigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";

// css styling
import styles from "../css/Login.module.css";

function Login() {
  const { user, login } = useAuth();
  const location = useLocation();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user === undefined) return null; // still checking the login cookie

  // Also runs right after logging in, because login() sets the user.
  if (user) return <Navigate to={location.state?.from ?? "/home"} replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    setError("");
    setSubmitting(true);
    try {
      await login(form.get("email"), form.get("password"));
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <form className={styles.loginBox} onSubmit={handleSubmit}>
      <h2>Log in to your account</h2>

      <input
        className={styles.input}
        name="email"
        type="email"
        placeholder="email"
        required
      ></input>

      <input
        className={styles.input}
        name="password"
        type="password"
        placeholder="password"
        required
      ></input>

      {error && (
        <div className={styles.error} role="alert">
          {error}
        </div>
      )}

      <button type="submit" disabled={submitting}>
        Login
      </button>

      <Link to="/register" state={location.state} className={styles.text}>
        Don't have an account? Register for one here!
      </Link>
    </form>
  );
}

export default Login;
