import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Machine from './components/Machine.jsx'
import MainMenu from './pages/MainMenu.jsx'
import MachineScreen from './pages/MachineScreen.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MachineScreen machine={0o1}/>
  </StrictMode>,
)
