import { Route } from 'react-router-dom';
import ChatPage from '../pages/ChatPage';
import NotFoundPage from '../pages/NotFoundPage';
import LoginPage from '../pages/LoginPage';
import SignUpPage from '../pages/SignUpPage';
import PrivateRoute from './PrivateRouter';

const Routes = {
  getRouteToChatPage: () => (
    <Route element={<PrivateRoute />}>
      <Route path="/" element={<ChatPage />} />
    </Route>
  ),
  getRouteToNotFoundPage: () => <Route path="*" element={<NotFoundPage />} />,
  getRouteToLoginPage: () => <Route path="/login" element={<LoginPage />} />,
  getRouteToSignupPage: () => <Route path="/signup" element={<SignUpPage />} />,
};

export default Routes;
