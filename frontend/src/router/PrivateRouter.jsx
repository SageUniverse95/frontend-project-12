import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/authContext.js';

const PrivateRoute = () => {
  const { loggedIn } = useContext(AuthContext);
  console.log(loggedIn);
  return (
    loggedIn ? <Outlet /> : <Navigate to="/login" />
  );
};

export default PrivateRoute;
