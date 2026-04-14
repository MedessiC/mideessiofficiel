import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useClientAuth } from '../contexts/ClientContext';

interface ClientProtectedRouteProps {
  children: ReactNode;
}

const ClientProtectedRoute = ({ children }: ClientProtectedRouteProps) => {
  const { user, loading } = useClientAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-midnight via-blue-900 to-indigo-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/clients" replace />;
  }

  return <>{children}</>;
};

export default ClientProtectedRoute;
