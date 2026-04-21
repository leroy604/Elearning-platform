import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireInstructor?: boolean;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireInstructor = false, requireAdmin = false }: ProtectedRouteProps) => {
  const { isAuthenticated, isInstructor, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner w-12 h-12"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card-glass p-12 text-center max-w-md">
          <div className="text-5xl mb-4">🔐</div>
          <h2 className="text-2xl font-bold text-white mb-3">Admin Access Required</h2>
          <p className="text-white/60 mb-6">
            This page is only accessible to system administrators.
          </p>
          <a href="/" className="btn-primary px-8 py-3 inline-block">Back to Courses</a>
        </div>
      </div>
    );
  }

  if (requireInstructor && !isInstructor) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card-glass p-12 text-center max-w-md">
          <div className="text-5xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-white mb-3">Access Denied</h2>
          <p className="text-white/60 mb-6">
            This page is only accessible to instructors. 
            If you are an instructor, please log in with your instructor account.
          </p>
          <a href="/" className="btn-primary px-8 py-3 inline-block">Back to Courses</a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
