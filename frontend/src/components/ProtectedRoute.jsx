import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { EmptyState } from './ui.jsx'

export default function ProtectedRoute({ adminOnly = false }) {
  const { user, isAdmin } = useAuth()
  const location = useLocation()

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  if (adminOnly && !isAdmin) {
    return <EmptyState title="Admins only">You don't have permission to view this page.</EmptyState>
  }
  return <Outlet />
}
