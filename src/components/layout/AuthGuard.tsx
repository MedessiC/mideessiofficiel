import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useClientAuth } from '../../contexts/ClientContext';

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useClientAuth();
  const location = useLocation();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!loading) {
      setChecked(true);
    }
  }, [loading]);

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-page)]">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--brand-midnight)] text-white shadow-glow">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/25 border-t-white" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/clients" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
