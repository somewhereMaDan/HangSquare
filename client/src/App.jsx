import { useState } from 'react'
import './App.css'
import Login from './pages/Login'
import { Toaster } from "sonner";
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Navbar } from './components/Navbar';
import Homepage from './pages/Homepage';
import RedirectProfile from './components/RedirectProfile';

function App() {
  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Content /> {/* Render a separate component to handle routing */}
      </BrowserRouter>
    </>
  )
}

function Content() {
  const location = useLocation(); // Moved useLocation inside the BrowserRouter

  return (
    <>
      {location.pathname !== '/' && <Navbar />} {/* Conditionally render Navbar */}
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/home' element={<Homepage />} />
        <Route path='/redirectProfile' element={<RedirectProfile />} />
      </Routes>
    </>
  )
}

export default App;
