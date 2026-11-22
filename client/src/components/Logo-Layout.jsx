// Author: Grace Yuzwin

// link imports
import {Outlet} from "react-router-dom";

// components
import NavBar from "./Login-Navbar"

// css styling
import styles from "../css/Layout.module.css"

function Layout() {
    return <div className={styles.appContainer}>
        <NavBar />
        <main className={styles.mainContent}>
            <Outlet />
        </main>
    </div>
}

export default Layout