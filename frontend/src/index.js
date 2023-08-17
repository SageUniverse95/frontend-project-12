import React from 'react';
import { Provider, useDispatch } from 'react-redux';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { io } from 'socket.io-client';
import ReactDOM from 'react-dom/client';
import resources from './locales/resources.js';
import SocketApiContext from './context/socketApi.Context.js';
import { addMessage } from './slices/messageSlice.js';
import {
  addChannel, addCurrentId, updateChannel, removeChannel,
} from './slices/channelSlice.js';
import App from './components/App.jsx';
import store from './slices/configStore.js';

const SocketProvider = ({ children, socket }) => {
  const dispatch = useDispatch();

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

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const doSocketAction = (data, action) => new Promise((resolve, reject) => {
    socket.timeout(5000).emit(action, data, (err, responce) => {
      if (err) reject(err);
      resolve(responce.status);
    });
  });

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <SocketApiContext.Provider value={{ doSocketAction }}>
      {children}
    </SocketApiContext.Provider>
  );
};

const runApp = async () => {
  const root = ReactDOM.createRoot(document.getElementById('chat'));
  const socket = io();
  await i18next
    .use(initReactI18next)
    .init({
      resources,
      interpolation: {
        escapeValue: false,
      },
      fallbackLng: 'ru',
      debug: true,
    });

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <SocketProvider socket={socket}>
          <App />
        </SocketProvider>
      </Provider>
    </React.StrictMode>,
  );
};

runApp();
