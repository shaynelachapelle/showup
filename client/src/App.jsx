// Author: Grace Yuzwin, Shayne Lachapelle

import './App.css'
import {Routes, Route} from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import NavLayout from "./components/Nav-Layout.jsx"
import LogoLayout from "./components/Logo-Layout.jsx"

// Pages w/o NavBar and Footer
import Landing from './pages/Landing.jsx';

// Pages with just logo in nav bar
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

// Pages with NavBar and Footer
import Home from './pages/Home.jsx';
import AllEvents from './pages/AllEvents.jsx';
import CategorizedEvents from './pages/CategorizedEvents.jsx';
import MyOrgs from './pages/MyOrgs.jsx';
import MyEvents from './pages/MyEvents.jsx';
import EventPage from './pages/EventPage.jsx';
import OrganizationPage from './pages/OrganizationPage.jsx';
import SearchResults from './pages/SearchResults.jsx'
import MyClubs from './pages/MyClubs'; 
import JoinClub from './pages/JoinClub.jsx';
import PostEvent from './pages/PostEvent.jsx';
import EventAttendees from './pages/EventAttendees.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

    <Route element={<LogoLayout />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Route>  

    <Route element={<ProtectedRoute />}>
    <Route element={<NavLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/allevents" element={<AllEvents />} />
        <Route path="/allevents/:category" element={<CategorizedEvents />} />
        <Route path="/myorgs" element={<MyOrgs />} />
        <Route path="/myevents" element={<MyEvents />} />
        <Route path="/events/:id" element={<EventPage />} />
        <Route path="/organization/:organizationId" element={<OrganizationPage />} />
        <Route path="/myclubs" element={<MyClubs />} />
        <Route path="/joinclub" element={<JoinClub/>} />
        <Route path="postevent" element={<PostEvent/>} />
        <Route path="/events/:id/eventattendees" element={<EventAttendees />} />
        <Route path="/search" element={<SearchResults />} />
      </Route>
    </Route>
    </Routes>
  )
}

export default App
