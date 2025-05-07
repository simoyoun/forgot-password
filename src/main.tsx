import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './router'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from './auth/AuthProvider'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
)
