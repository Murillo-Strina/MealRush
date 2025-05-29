import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Machine from './components/Machine.jsx'
import MainMenu from './pages/MainMenu.jsx'
import MachineScreen from './pages/MachineScreen.jsx'
import LoginScreen from './pages/LoginScreen.jsx'
import ManagementScreen from './pages/ManagementScreen.jsx'
import AdminScreen from './pages/AdminScreen.jsx'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import {PrivateRoute} from './components/PrivateRoute.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/machine" element={<MachineScreen />} />
        <Route path="/simulation" element={<Machine />} />
        <Route path="/admin" element={<PrivateRoute><AdminScreen /></PrivateRoute>} />
        <Route path="/management" element={<PrivateRoute><ManagementScreen /></PrivateRoute>} />	
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
