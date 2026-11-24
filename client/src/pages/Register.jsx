// Author: Grace Yuzwin, Shayne Lachapelle
import { Link, Navigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";

// css styling
import styles from "../css/Login.module.css";

function Register() {
  const { user, register } = useAuth();
  const location = useLocation();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user === undefined) return null; // still checking the login cookie

  // Also runs right after registering, because register() sets the user.
  if (user) return <Navigate to={location.state?.from ?? "/home"} replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    // The API stores a single name.
    const name = `${form.get("Fname").trim()} ${form.get("Lname").trim()}`;

    setError("");
    setSubmitting(true);
    try {
      await register(name, form.get("email"), form.get("password"));
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <form className={styles.loginBox} onSubmit={handleSubmit}>
      <h2>Register for an account</h2>

      <input
        className={styles.input}
        name="Fname"
        type="text"
        placeholder="first name"
        required
      ></input>

      <input
        className={styles.input}
        name="Lname"
        type="text"
        placeholder="last name"
        required
      ></input>

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
        Register
      </button>

      <Link to="/login" state={location.state} className={styles.text}>
        Have an account? Login here!
      </Link>
    </form>
  );
}

export default Register;
