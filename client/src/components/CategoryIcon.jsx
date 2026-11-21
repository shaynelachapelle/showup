// Author: Grace Yuzwin

import { Link } from "react-router-dom";

// css styling
import styles from "../css/CategoryIcon.module.css"

function CategoryIcon({ title, icon, link }) {
    return (
        <Link to={link} className={styles.container}>
            <div className={styles.circle}>
                <img src={icon} className={styles.icon}></img>
            </div>
            <div className={styles.text}>{title}</div>
        </Link>
    );
}

export default CategoryIcon;