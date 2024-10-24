import authToken from '@/cookies/appCookies';
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

type PrivateRouteProps = {
  children: ReactNode;
};

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const token = document.cookie.split(`${authToken}=`)[1];
  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;