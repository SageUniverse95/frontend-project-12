import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/authContext.js';

const PrivateRoute = () => {
  const { user } = useContext(AuthContext);
  return (
    user.loggedIn ? <Outlet /> : <Navigate to="/login" />
  );
};

export default PrivateRoute;
