import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { SimuladorProvider } from './simulador.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <SimuladorProvider>
    <App />
  </SimuladorProvider>,
)
