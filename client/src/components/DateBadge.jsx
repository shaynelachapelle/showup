import styles from "../css/DateBadge.module.css"
import { getMonthAbbreviation, getDayOfMonth } from "../helper-functions/dates"

function DateBadge({ date }) {
    return (
        <div className={styles.badge}>
            <div className={styles.month}>
                {getMonthAbbreviation(date)}
            </div>
            <div className={styles.day}>
                {getDayOfMonth(date)}
            </div>
            
        </div>
    );
}

export default DateBadge;