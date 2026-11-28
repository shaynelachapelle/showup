// Author: Grace Yuzwin

// components
import CategoryIcon from "../components/CategoryIcon";

// css styles
import styles from "../css/CategoryRow.module.css"

// icons for events
import imageRunning from "../assets/running.png"
import imageCharity from "../assets/world-peace.png"
import imageCommunity from "../assets/help.png"
import imageArts from "../assets/theater.png"
import imageHealth from "../assets/heart.png"
import imageLanguage from "../assets/public-relation.png"
import imageLeisure from "../assets/hobbies.png"
import imageNetworking from "../assets/thought-leadership.png"
import imagePolitical from "../assets/demonstrator.png"
import imageReligion from "../assets/network.png"

function CategoryRow () {
    return (
        <div className={styles.categories}>
            <CategoryIcon title="Athletics and Recreation" icon={imageRunning} link="/explore/Athletics+and+Recreation" />
            <CategoryIcon title="Charity and Environment" icon={imageCharity} link="/explore/Charity+and+Environment" />
            <CategoryIcon title="Community Outreach and Volunteering" icon={imageCommunity} link="/explore/Community+Outreach+and+Volunteering" />
            <CategoryIcon title="Fine Arts, Dance and Performance" icon={imageArts} link="/explore/Fine+Arts,+Dance+and+Performance" />
            <CategoryIcon title="Health and Wellness" icon={imageHealth} link="/explore/Health+and+Wellness" />
            <CategoryIcon title="Language and Publications" icon={imageLanguage} link="/explore/Language+and+Publications" />
            <CategoryIcon title="Leisure and Hobbies" icon={imageLeisure} link="/explore/Leisure+and+Hobbies" />   
            <CategoryIcon title="Networking and Leadership" icon={imageNetworking} link="/explore/Networking+and+Leadership" />
            <CategoryIcon title="Political and Social Activism" icon={imagePolitical} link="/explore/Political+and+Social+Activism" />
            <CategoryIcon title="Religion and Culture" icon={imageReligion} link="/explore/Religion+and+Culture" />
        </div>
    );
}

export default CategoryRow;