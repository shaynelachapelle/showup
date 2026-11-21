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
import MyClubs from './pages/My-Clubs'; 

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

    <Route element={<Layout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/allevents" element={<AllEvents />} />
        <Route path="/allorgs" element={<AllOrgs />} />
        <Route path="/myorgs" element={<MyOrgs />} />
        <Route path="/myevents" element={<MyEvents />} />
        <Route path="/events/:id" element={<EventPage />} />
        <Route path="/organization/:organizationId" element={<OrganizationPage />} />
        <Route path="/my-clubs" element={<MyClubs />} />
      </Route>
    </Routes>
  )
}

export default App
