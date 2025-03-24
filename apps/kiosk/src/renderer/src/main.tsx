import './assets/main.pcss'

import React from 'react'
import ReactDOM from 'react-dom/client'
import Routes from './Routes'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Toaster />
    <Routes />
  </React.StrictMode>
)
