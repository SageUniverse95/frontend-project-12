import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const isLogin = localStorage.getItem('userId');
  return (
    isLogin ? <Outlet /> : <Navigate to="/login" />
  );
};

export default PrivateRoute;
