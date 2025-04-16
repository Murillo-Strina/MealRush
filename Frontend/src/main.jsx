import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Machine from './components/Machine.jsx'
import MainMenu from './pages/MainMenu.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MainMenu />
  </StrictMode>,
)
