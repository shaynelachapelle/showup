import {Outlet} from "react-router-dom";
import NavBar from "./NavBar"
import Footer from "./Footer"
import "../css/Layout.css"

function Layout() {
    return <div className="app-container">
        <NavBar />
        <main className="main-content">
            <Outlet />
        </main>
        <Footer />
    </div>
}

export default Layout