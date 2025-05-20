import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import App from './App.jsx'
import Machine from './components/Machine.jsx'
import MainMenu from './pages/MainMenu.jsx'
import MachineScreen from './pages/MachineScreen.jsx'
import LoginScreen from './pages/LoginScreen.jsx'

import 'bootstrap/dist/css/bootstrap.min.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/menu" element={<LoginScreen />} />
        <Route path="/machine" element={<MachineScreen />} />
        <Route path="/simulation" element={<Machine />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
