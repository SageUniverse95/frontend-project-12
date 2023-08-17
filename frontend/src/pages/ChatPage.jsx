import { Button } from 'react-bootstrap';
import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import routes from '../routes.js';
import { addChanels, addCurrentId } from '../slices/channelSlice.js';
import { addMessages } from '../slices/messageSlice.js';
import Header from '../components/Header';
import LeftSideBar from '../components/LeftSideBar';
import Chat from '../components/Сhat';
import AppContext from '../context/auth.context.js';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));

  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }

  return {};
};

const ChatPage = () => {
  const { logOut } = useContext(AppContext);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    const getData = async () => {
      try {
        const resp = await axios.get(routes.getDataPath(), { headers: getAuthHeader() });
        const { channels, currentChannelId, messages } = resp.data;
        dispatch(addChanels(channels));
        dispatch(addCurrentId(currentChannelId));
        dispatch(addMessages(messages));
      } catch (error) {
        console.log(error);
        throw error;
      }
    };
    getData();
  }, []);

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
