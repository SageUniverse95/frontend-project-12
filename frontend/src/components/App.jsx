import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import LoginPage from '../pages/LoginPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import ChatPage from '../pages/ChatPage.jsx';
import AppContext from '../context/app.context.js';
import { addMessage } from '../slices/messageSlice.js';
import { addChannel, addCurrentId, updateChannel } from '../slices/channelSlice.js';

const socket = io('http://localhost:3000');

const AppProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const dispatch = useDispatch();
  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };
  const socketApi = {
    subscribeOnMessage: () => socket.on('newMessage', (payload) => {
      dispatch(addMessage(payload));
    }),

    subscribeOnNewChannel: () => socket.on('newChannel', (payload) => {
      const { id } = payload;
      dispatch(addCurrentId(id));
      dispatch(addChannel(payload));
    }),

    subscribeOnUpdChannel: () => socket.on('renameChannel', (payload) => {
      const { id } = payload;
      dispatch(updateChannel({ id, changes: payload }));
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

const App = () => (
  <BrowserRouter>
    <AppProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ChatPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppProvider>
  </BrowserRouter>

);

export default App;
