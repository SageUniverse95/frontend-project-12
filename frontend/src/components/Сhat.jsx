import { Button, Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useEffect, useContext, useRef } from 'react';
import * as leoProfanity from 'leo-profanity';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import routes from '../routes';
import { addChanels, addCurrentId } from '../slices/channelSlice.js';
import { addMessages, messageSelect } from '../slices/messageSlice.js';
import getCurrentId from '../selectors/selector.js';
import AppContext from '../context/app.context';
import Notify from './NotifyTest.jsx';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));

  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }

  return {};
};

const Chat = () => {
  const russianDictionary = leoProfanity.getDictionary('ru');
  leoProfanity.add(russianDictionary);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { socketApi, loggedIn } = useContext(AppContext);
  const dispatch = useDispatch();
  const currentIDChannel = useSelector(getCurrentId);
  const inputMessage = useRef();

  useEffect(() => {
    if (loggedIn) {
      navigate('/');
    }
  }, [loggedIn]);

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
        navigate('/login');
      }
    };
    getData();
    inputMessage.current.focus();
  }, []);

  const nameOfChannel = useSelector((state) => {
    const { entities } = state.channels;
    const result = entities[currentIDChannel]?.name;
    return result;
  });
  const messages = useSelector(messageSelect.selectAll)
    .filter(({ channelId }) => channelId === currentIDChannel)
    .map(({ body, username, id }) => (
      <div className="text-break mb-2" key={id}>
        <b>{username}</b>
        {': '}
        {body}
      </div>
    ));
  const formik = useFormik({
    initialValues: {
      message: '',
    },
    onSubmit: async (values, { resetForm }) => {
      const userName = JSON.parse(localStorage.getItem('userId')).username;
      const filtredMessage = leoProfanity.clean(values.message);
      const data = { body: filtredMessage, channelId: currentIDChannel, username: userName };
      const test = await socketApi.addNewMessage(data);
      resetForm();
      console.log(test);
      inputMessage.current.focus();
    },
  });

  return (
    <div className="col p-0 h-100">
      <div className="d-flex flex-column h-100">
        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="m-0">
            <b>
              #
              {' '}
              {nameOfChannel || null}
            </b>
          </p>
          <span className="text-muted">{t('counter.count', { count: messages.length })}</span>
        </div>
        <div id="messages-box" className="chat-messages overflow-auto px-5 ">
          {messages || null}
        </div>
        <div className="mt-auto px-5 py-3">
          <Form noValidate className="py-1 border rounded-2" onSubmit={formik.handleSubmit}>
            <Form.Group className={`input-group ${formik.values.message ? '' : 'has-validation'}`}>
              <Form.Control
                className="border-0 p-0 ps-2"
                onChange={formik.handleChange}
                value={formik.values.message}
                ref={inputMessage}
                placeholder={t('chat.inputMessage')}
                name="message"
                aria-label="Новое сообщение"
              />
              <Form.Label htmlFor="messages-box" />
              <Button className="border-0" type="submit" variant="group-vertical" disabled={!formik.values.message.length}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  width="20"
                  height="20"
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
                </svg>
                <span className="visually-hidden">{t('buttons.sendBtn')}</span>
              </Button>
            </Form.Group>
          </Form>
        </div>
      </div>
      <Notify />
    </div>
  );
};

export default Chat;
