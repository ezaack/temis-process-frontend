import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user } = useUserContext();
  console.log('User state in PrivateRoute:', user);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default PrivateRoute; 