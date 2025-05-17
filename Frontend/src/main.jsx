import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Machine from './components/Machine.jsx'
import MainMenu from './pages/MainMenu.jsx'
import MachineScreen from './pages/MachineScreen.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import LoginScreen from './pages/LoginScreen.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoginScreen/>
  </StrictMode>,
)
