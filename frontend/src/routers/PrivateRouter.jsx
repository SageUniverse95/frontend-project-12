import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/authContext.js';
import routesPath from '../routesPath.js';

const PrivateRoute = () => {
  const { user } = useContext(AuthContext);
  return (
    user.loggedIn ? <Outlet /> : <Navigate to={routesPath.getLoginPage()} />
  );
};

export default PrivateRoute;
