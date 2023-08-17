import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import {
  BrowserRouter, Routes, Route,
} from 'react-router-dom';

import { Provider, ErrorBoundary } from '@rollbar/react';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import routes from '../routes.js';
import LoginPage from '../pages/LoginPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import SingUpPage from '../pages/SingUpPage.jsx';
import ChatPage from '../pages/ChatPage.jsx';
import AuthContext from '../context/auth.context.js';
import PrivateRoute from '../router/PrivateRouter.jsx';

const AuthProvider = ({ children }) => {
  const isLogin = !!localStorage.getItem('userId');
  const [loggedIn, setLoggedIn] = useState(isLogin);
  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    setLoggedIn(false);
    localStorage.removeItem('userId');
  };

  const checkAuth = async (userData) => {
    const resp = await axios.post(routes.getLoginPath(), userData);
    const token = resp.data;
    localStorage.setItem('userId', JSON.stringify(token));
  };

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <AuthContext.Provider value={{
      loggedIn, logIn, logOut, checkAuth,
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
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<ChatPage />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/signup" element={<SingUpPage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
    <ToastContainer />
  </Provider>
);

export default App;
