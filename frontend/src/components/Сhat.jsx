import { Button, Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useEffect, useContext, useRef } from 'react';
import * as leoProfanity from 'leo-profanity';
import { useSelector } from 'react-redux';
import { messageSelect } from '../slices/messageSlice.js';
import getCurrentId from '../selectors/selector.js';
import AuthContext from '../context/authContext.js';
import SocketApiContext from '../context/socketApiContext.js';
import Svg from './svg/SvgChat.jsx';

const Chat = () => {
  const russianDictionary = leoProfanity.getDictionary('ru');
  leoProfanity.add(russianDictionary);
  const { t } = useTranslation();
  const { doSocketAction } = useContext(SocketApiContext);
  const { currentUserName } = useContext(AuthContext);
  const currentIDChannel = useSelector(getCurrentId);
  const inputMessage = useRef();

  useEffect(() => {
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
      const filtredMessage = leoProfanity.clean(values.message);
      const data = { body: filtredMessage, channelId: currentIDChannel, username: currentUserName };
      await doSocketAction(data, 'newMessage');
      resetForm();
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
            <Form.Group controlId="messages-box" className={`input-group ${formik.values.message ? '' : 'has-validation'}`}>
              <Form.Control
                className="border-0 p-0 ps-2"
                onChange={formik.handleChange}
                value={formik.values.message}
                ref={inputMessage}
                placeholder={t('chat.inputMessage')}
                name="message"
                aria-label="Новое сообщение"
              />
              <Button className="border-0" type="submit" variant="group-vertical" disabled={!formik.values.message.length}>
                <Svg />
                <span className="visually-hidden">{t('buttons.sendBtn')}</span>
              </Button>
            </Form.Group>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
