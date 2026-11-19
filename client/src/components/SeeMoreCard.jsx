import { Link } from "react-router-dom";
import styles from "../css/SeeMoreCard.module.css";

function SeeMoreCard ({ to }) {
    return (
        <Link
            to={to}
            className={styles.card}
        >
            <div className={styles.text}>
                See More
            </div>
        </Link>

    );
}

export default SeeMoreCard;