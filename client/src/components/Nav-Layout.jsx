// Author: Grace Yuzwin

import {Outlet} from "react-router-dom";

// components
import NavBar from "./NavBar"
import Footer from "./Footer"

// css styling
import styles from "../css/Layout.module.css"

function Layout() {
    return <div className={styles.appContainer}>
        <NavBar />
        <main className={styles.mainContent}>
            <Outlet />
        </main>
        <Footer />
    </div>
}

export default Layout