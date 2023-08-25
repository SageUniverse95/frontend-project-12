import React from 'react';
import { Provider } from 'react-redux';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { io } from 'socket.io-client';
import ReactDOM from 'react-dom/client';
import resources from './locales/resources.js';
import App from './components/App.jsx';
import store from './slices/configStore.js';
import SocketProvider from './providers/SocketIoProvider.jsx';

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
