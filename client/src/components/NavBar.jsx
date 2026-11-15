import styles from "../css/NavBar.module.css"
import image from "../images/logo.png"

function NavBar() {
    return <div className={styles.navBar}>
        <img className={styles.logo} src={image}/>
    </div>
} 

export default NavBar