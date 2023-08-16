import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import {
  BrowserRouter, Routes, Route,
} from 'react-router-dom';

import { Provider, ErrorBoundary } from '@rollbar/react';
import { ToastContainer } from 'react-toastify';
import LoginPage from '../pages/LoginPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import SignUpPage from '../pages/SingUpPage.jsx';
import ChatPage from '../pages/ChatPage.jsx';
import AuthContext from '../context/app.context.js';
import PrivateRoute from '../router/PrivateRouter.jsx';

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <AuthContext.Provider value={{
      loggedIn, logIn, logOut,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const rollbarConfig = {
  accessToken: '722e909946084384bf085767391cf095',
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
            <Route path="/signup" element={<SignUpPage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
    <ToastContainer />
  </Provider>
);

export default App;
