import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// extras
import 'leaflet/dist/leaflet.css';					// leaflet			-> biblioteca de mapas
import "bootstrap/dist/css/bootstrap.min.css";		// bootstrap css	-> estilos bootstrap
import "bootstrap/dist/js/bootstrap.bundle.min.js";	// bootstrap js		-> funcoes bootstrap

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
