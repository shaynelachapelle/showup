// Author: Grace Yuzwin

// css styling
import styles from "../css/NavBar.module.css"

// logo
import image from "../assets/logo.png"

// link import
import { Link } from 'react-router-dom';

function LoginNavbar() {
    return <div className={styles.navBar}>
            <Link to="/">
                <img className={styles.logo} src={image}/>
            </Link>
    </div>
}

export default LoginNavbar;