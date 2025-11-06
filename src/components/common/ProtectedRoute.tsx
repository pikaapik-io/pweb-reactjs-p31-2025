// src/components/common/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // Tunggu sampai pengecekan token selesai
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    // Arahkan (redirect) ke halaman Login [cite: 29]
    return <Navigate to="/login" replace />;
  }

  // Jika lolos, tampilkan halaman (Books, Transactions, dll)
  return <Outlet />;
};

export default ProtectedRoute;