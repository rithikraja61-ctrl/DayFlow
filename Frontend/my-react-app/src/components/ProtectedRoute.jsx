import { Navigate } from 'react-router-dom'
import { getSession } from '../api/auth'

export default function ProtectedRoute({ children }) {
  const session = getSession()

  if (!session?.token) {
    return <Navigate to="/" replace />
  }

  return children
}
