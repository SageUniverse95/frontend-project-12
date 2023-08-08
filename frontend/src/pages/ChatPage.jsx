import { Button } from 'react-bootstrap';
import { useContext } from 'react';
import Header from '../components/Header';
import LeftSideBar from '../components/leftSideBar';
import Chat from '../components/Сhat';
import AppContext from '../context/app.context';

const ChatPage = () => {
  const { logOut } = useContext(AppContext);
  return (
    <div className="h-100">
      <div className="d-flex flex-column h-100">
        <Header>
          <Button type="button" onClick={logOut} variant="primary">Выйти</Button>
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
