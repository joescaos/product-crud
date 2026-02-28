import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "./styles/variables.css";
import "./styles/global.css";
import "./styles/layout.css";
import "./styles/table.css";
import "./styles/form.css";
import "./styles/buttons.css";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
