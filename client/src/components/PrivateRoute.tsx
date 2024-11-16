
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface PrivateRouteProps {
  userId: number;
  isLoading: boolean; 
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ userId,isLoading }) => {
 if(!isLoading && userId === 0 ) {
   return <Navigate to="/login" />;
 }

  return <Outlet />;
};

export default PrivateRoute;
