import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from './AuthContext';

/** Gate for admin routes: redirects unauthenticated / non-admin users to login. */
export function ProtectedRoute() {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-50">
        <Loader2 className="animate-spin text-brand-600" size={32} />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
