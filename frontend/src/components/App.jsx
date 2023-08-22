import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import {
  BrowserRouter, Routes,
} from 'react-router-dom';
import { Provider, ErrorBoundary } from '@rollbar/react';
import { ToastContainer } from 'react-toastify';
import AuthContext from '../context/authContext.js';
import routes from '../router/Routers.jsx';

const AuthProvider = ({ children }) => {
  const isLogin = !!localStorage.getItem('userId');
  const [loggedIn, setLoggedIn] = useState(isLogin);
  const [token, setToken] = useState(null);
  const currentUserName = JSON.parse(localStorage.getItem('userId'))?.username;
  const logIn = (data) => {
    localStorage.setItem('userId', JSON.stringify(data));
    setToken(data.token);
    setLoggedIn(true);
  };

  const logOut = () => {
    setLoggedIn(false);
    localStorage.removeItem('userId');
  };

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <AuthContext.Provider value={{
      loggedIn, logIn, logOut, currentUserName, token,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const rollbarConfig = {
  accessToken: process.env.SECRET_KEY,
  environment: 'testenv',
};

const App = () => (
  <Provider config={rollbarConfig}>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {routes.getRouteToChatPage()}
            {routes.getRouteToLoginPage()}
            {routes.getRouteToNotFoundPage()}
            {routes.getRouteToSignupPage()}
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
    <ToastContainer />
  </Provider>
);

export default App;
