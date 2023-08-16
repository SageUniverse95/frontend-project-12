import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/app.context';

const PrivateRoute = () => {
  const { loggedIn } = useContext(AuthContext);
  return (
    loggedIn ? <Outlet /> : <Navigate to="/login" />
  );
};

export default PrivateRoute;
