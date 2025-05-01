import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const RoleRoute = ({ children, requiredRoles }) => {
  const { currentUser, userRoles } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }

  const hasRequiredRole = Object.entries(requiredRoles).every(
    ([role, required]) => !required || userRoles[role]
  );

  if (!hasRequiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleRoute; 