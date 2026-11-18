// Author: Grace Yuzwin
import { Link } from "react-router-dom";
import styles from "../css/Login.module.css"

function Login() {
    return (
        <div className={styles.loginBox}>
            <h2>Log in to your account</h2>

            <input className={styles.input} name="email" type="email" placeholder="email" required></input>

            <input className={styles.input} name="password" type="password" placeholder="password" required></input>

            <button type="submit">Login</button>

            <Link to="/register" className={styles.text}>Don't have an account? Register for one here!</Link>
        </div>
    );
}

export default Login