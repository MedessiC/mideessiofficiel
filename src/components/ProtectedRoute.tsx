import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, AppRole } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Si fourni, l'utilisateur doit avoir ce rôle (ou 'admin') pour accéder. */
  requiredRole?: AppRole;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading, profile, isAdmin } = useAuth();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (loading) {
    return <LoadingSpinner fullScreen size="lg" />;
  }

  // Non connecté → redirection vers la page de connexion appropriée
  if (!user) {
    return <Navigate to={isAdminRoute ? '/admin/login' : '/login'} replace />;
  }

  // Vérification du rôle si requis
  // Un admin a toujours accès, même si le requiredRole est 'cofondateur' ou 'membre'
  if (requiredRole && !isAdmin && profile?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
