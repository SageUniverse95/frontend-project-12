/* eslint-disable max-len */
import { Route } from 'react-router-dom';
import ChatPage from '../pages/ChatPage';
import NotFoundPage from '../pages/NotFoundPage';
import LoginPage from '../pages/LoginPage';
import SignUpPage from '../pages/SignUpPage';
import PrivateRoute from './PrivateRouter';
import routesPath from '../routesPath';

const Routes = {
  getRouteToChatPage: () => (
    <Route element={<PrivateRoute />}>
      <Route path={routesPath.getChatPage()} element={<ChatPage />} />
    </Route>
  ),
  getRouteToNotFoundPage: () => <Route path={routesPath.getNotFoundPage()} element={<NotFoundPage />} />,
  getRouteToLoginPage: () => <Route path={routesPath.getLoginPage()} element={<LoginPage />} />,
  getRouteToSignupPage: () => <Route path={routesPath.getSignupPage()} element={<SignUpPage />} />,
};

export default Routes;
