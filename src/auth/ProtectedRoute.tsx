import { Navigate } from '@tanstack/react-router'
import { useAuth } from './AuthProvider'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return <>{children}</>
}
