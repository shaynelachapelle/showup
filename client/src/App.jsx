// Authors: Grace Yuzwin & Shayne Lachapelle
import { useState } from 'react'
import './App.css'
import { Routes, Route } from "react-router-dom"
import Landing from './pages/Landing';
import MyClubs from './pages/My-Clubs';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/my-clubs" element={<MyClubs />} />
    </Routes>
  )
}

export default App
