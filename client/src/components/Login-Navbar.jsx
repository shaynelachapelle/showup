// Author: Grace Yuzwin
import styles from "../css/NavBar.module.css"
import image from "../images/logo.png"
import { Link } from 'react-router-dom';

function LoginNavbar() {
    return <div className={styles.navBar}>
            <Link to="/">
                <img className={styles.logo} src={image}/>
            </Link>
    </div>
}

export default LoginNavbar;