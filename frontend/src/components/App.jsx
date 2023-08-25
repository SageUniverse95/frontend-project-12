import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import {
  BrowserRouter, Routes,
} from 'react-router-dom';
import { Provider, ErrorBoundary } from '@rollbar/react';
import { ToastContainer } from 'react-toastify';
import routes from '../routers/Routers.jsx';
import AuthProvider from '../providers/AuthProvider.jsx';

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
