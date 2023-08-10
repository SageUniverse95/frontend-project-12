import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import {
  BrowserRouter, Routes, Route, useNavigate,
} from 'react-router-dom';
import { io } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { Provider, ErrorBoundary } from '@rollbar/react';
import LoginPage from '../pages/LoginPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import SingUpPage from '../pages/singUpPage.jsx';
import ChatPage from '../pages/ChatPage.jsx';
import AppContext from '../context/app.context.js';
import { addMessage } from '../slices/messageSlice.js';
import {
  addChannel, addCurrentId, updateChannel, removeChannel,
} from '../slices/channelSlice.js';

const socket = io('http://localhost:3000');

const AppProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
    navigate('/login');
  };

  useEffect(() => {
    socket.on('newMessage', (payload) => {
      dispatch(addMessage(payload));
    });

    socket.on('newChannel', (payload) => {
      const { id } = payload;
      dispatch(addCurrentId(id));
      dispatch(addChannel(payload));
    });

    socket.on('renameChannel', (payload) => {
      const { id } = payload;
      dispatch(updateChannel({ id, changes: payload }));
    });

    socket.on('removeChannel', (payload) => {
      const { id } = payload;
      dispatch(removeChannel(id));
      dispatch(addCurrentId(1));
    });
  }, []);

  const socketApi = {
    removingChannel: (data) => new Promise((resolve, reject) => {
      socket.emit('removeChannel', data, (responce) => {
        if (responce.status === 'ok') resolve(responce.status);
        reject(new Error('Ошибка удаления канала'));
      });
    }),

    renameChannel: (data) => new Promise((resolve, reject) => {
      socket.emit('renameChannel', data, (responce) => {
        if (responce.status === 'ok') resolve(responce.status);
        reject(new Error('Ошибка переименования канала'));
      });
    }),

    addNewChannel: (data) => new Promise((resolve, reject) => {
      socket.emit('newChannel', data, (responce) => {
        if (responce.status === 'ok') resolve(responce.status);
        reject(new Error('Ошибка добавления канала'));
      });
    }),

    addNewMessage: (data) => new Promise((resolve, reject) => {
      socket.emit('newMessage', data, (responce) => {
        if (responce.status === 'ok') resolve(responce.status);
        reject(new Error('Ошибка отправки сообщения'));
      });
    }),
  };
  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <AppContext.Provider value={{
      loggedIn, logIn, logOut, socketApi,
    }}
    >
      {children}
    </AppContext.Provider>
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
        <AppProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ChatPage />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/singup" element={<SingUpPage />} />
          </Routes>
        </AppProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </Provider>
);

export default App;
