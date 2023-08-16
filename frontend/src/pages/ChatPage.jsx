import { Button } from 'react-bootstrap';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import LeftSideBar from '../components/LeftSideBar';
import Chat from '../components/Сhat';
import AppContext from '../context/auth.context.js';

const ChatPage = () => {
  const { logOut } = useContext(AppContext);
  const { t } = useTranslation();
  return (
    <div className="h-100">
      <div className="d-flex flex-column h-100">
        <Header>
          <Button type="button" onClick={logOut} variant="primary">{t('buttons.logOutBtn')}</Button>
        </Header>
        <div className="container h-100 my-4 overflow-hidden rounded shadow">
          <div className="row h-100 bg-white flex-md-row">
            <LeftSideBar />
            <Chat />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
