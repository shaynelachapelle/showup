// Authors: Grace Yuzwin

import './App.css'
import {Routes, Route} from "react-router-dom"
import Layout from "./components/Layout.jsx"

// Pages w/o NavBar and Footer
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';

// Pages with NavBard and Footer
import Home from './pages/Home.jsx';
import AllEvents from './pages/AllEvents.jsx';
import AllOrgs from './pages/AllOrgs.jsx';
import MyOrgs from './pages/MyOrgs.jsx';
import MyEvents from './pages/MyEvents.jsx';
import EventPage from './pages/EventPage.jsx';
import OrganizationPage from './pages/OrganizationPage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/Login" element={<Login />} />

    <Route element={<Layout />}>
        <Route path="/Home" element={<Home />} />
        <Route path="/AllEvents" element={<AllEvents />} />
        <Route path="/AllOrgs" element={<AllOrgs />} />
        <Route path="/MyOrgs" element={<MyOrgs />} />
        <Route path="/MyEvents" element={<MyEvents />} />
        <Route path="/EventPage" element={<EventPage />} />
        <Route path="/OrganizationPage" element={<OrganizationPage />} />
      </Route>
    </Routes>
  )
}

export default App
