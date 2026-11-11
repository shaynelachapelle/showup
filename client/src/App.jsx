// Authors: Grace Yuzwin

import './App.css'
import { Routes, Route } from "react-router-dom"

// Import all pages
import Landing from './pages/Landing.jsx';
import Home from './pages/Home.jsx';
import AllEvents from './pages/AllEvents.jsx';
import AllOrgs from './pages/AllOrgs.jsx';
import Login from './pages/Login.jsx';
import MyEvents from './pages/MyEvents.jsx';
import EventPage from './pages/EventPage.jsx';
import OrganizationPage from './pages/OrganizationPage.jsx';


function App() {

  
  return (
    <Routes>
      <Route path="/" element={<Landing />}></Route>
      <Route path="/home" element={<Home />}></Route>
      <Route path="/allEvents" element={<AllEvents />}></Route>
      <Route path="/allOrgs" element={<AllOrgs />}></Route>
      <Route path="/allOrgs" element={<AllOrgs />}></Route>
      <Route path="/Login" element={<Login />}></Route>
      <Route path="/MyEvents" element={<MyEvents />}></Route>
      <Route path="/EventPage" element={<EventPage />}></Route>
      <Route path="/OrganizationPage" element={<OrganizationPage />}></Route>
    </Routes>
  )
}

export default App
