// Author: Grace Yuzwin

// needed import for link
import { Link } from "react-router-dom";

// css styling
import styles from "../css/Login.module.css"

function Register() {
    return (
            <div className={styles.loginBox}>
                <h2>Register for an account</h2>

                <input className={styles.input} name="Fname" type="text" placeholder="first name" required></input>

                <input className={styles.input} name="Lname" type="text" placeholder="last name" required></input>
    
                <input className={styles.input} name="email" type="email" placeholder="email" required></input>
    
                <input className={styles.input} name="password" type="password" placeholder="password" required></input>
    
                <button type="submit">Register</button>
    
                <Link to="/login" className={styles.text}>Have an account? Login here!</Link>
            </div>
        );
}

export default Register