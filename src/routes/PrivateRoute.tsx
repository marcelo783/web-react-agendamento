import authToken from '@/cookies/appCookies';

import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = document.cookie.split(`${authToken}=`)[1];
  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
