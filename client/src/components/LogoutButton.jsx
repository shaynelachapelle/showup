// Author: Grace Yuzwin

// css styling
import styles from "../css/LogoutButton.module.css"

function LogoutButton({ className = "" }) {
    return (
        <button className={`${styles.logout} ${className}`}>logout</button>
    );
}

export default LogoutButton;