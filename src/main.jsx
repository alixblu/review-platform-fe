import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from "@react-oauth/google";


import './Style/index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="573651962597-ghjrdckat3mquhrn5lufsevduduk2nlh.apps.googleusercontent.com">
                    <App />
            </GoogleOAuthProvider>
  </StrictMode>,
)
