import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "../node_modules/bootstrap/dist/css/Bootstrap.css"
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.js"
import { GlobalProvider } from './context/GlobalContext.jsx'
import { ExamineeProvider } from './context/ExamineeContext.jsx'
createRoot(document.getElementById('root')).render(
  <GlobalProvider>
     <ExamineeProvider>
        <App />
     </ExamineeProvider>
  </GlobalProvider>
   

)
