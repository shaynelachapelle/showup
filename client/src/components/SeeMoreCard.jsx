// Author: Grace Yuzwin

// link import
import { Link } from "react-router-dom";

// css styling
import styles from "../css/SeeMoreCard.module.css";

function SeeMoreCard ({ to, moreMessage }) {
    return (
        <Link
            to={to}
            className={styles.card}
        >
            <div className={styles.text}>
                {moreMessage}
            </div>
        </Link>

    );
}

export default SeeMoreCard;