import { useState } from 'react';
import AuthContext from '../context/authContext.js';

const AuthProvider = ({ children }) => {
  const isLogin = !!localStorage.getItem('userId');
  const [loggedIn, setLoggedIn] = useState(isLogin);
  const [token, setToken] = useState(null);
  const currentUserName = JSON.parse(localStorage.getItem('userId'))?.username;
  const user = {
    loggedIn,
    currentUserName,
    token,
  };
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
      logIn, logOut, user,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
