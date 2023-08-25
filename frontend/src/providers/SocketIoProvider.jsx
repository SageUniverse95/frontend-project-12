import { useDispatch } from 'react-redux';
import { addMessage } from '../slices/messageSlice.js';
import {
  addChannel, addCurrentId, updateChannel, removeChannel,
} from '../slices/channelSlice.js';

import SocketApiContext from '../context/socketApiContext.js';

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

export default SocketProvider;
