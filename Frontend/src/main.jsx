import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Machine from './components/Machine.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Machine />
  </StrictMode>,
)
