import React from 'react'
import { AuthProvider } from './app/contexts/auth'
import { LayoutProvider } from './app/contexts/layout/LayoutProvider'
import { AppRoutes } from './app/routes/routes'

function App() {

  return (
    <AuthProvider>
      <LayoutProvider>
        <AppRoutes />
      </LayoutProvider>
    </AuthProvider>
  )
}

export default App
