import { Button, Dropdown, ButtonGroup } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useContext } from 'react';
import { channelsSelect, addCurrentId } from '../slices/channelSlice';
import getModal from './modals/choiceModal.js';
import AppContext from '../context/app.context';

const renderModal = ({ modalInfo, hideModal }) => {
  if (!modalInfo.type) {
    return null;
  }

  const Component = getModal(modalInfo.type);
  return <Component modalInfo={modalInfo} onHide={hideModal} item={modalInfo.item} />;
};

const LeftSideBar = () => {
  const dispatch = useDispatch();
  const [modalInfo, setModalInfo] = useState({ type: null, item: null });
  const { socketApi } = useContext(AppContext);
  socketApi.subscribeOnUpdChannel();
  socketApi.subscribeOnNewChannel();
  const changeChannelHandle = (id) => {
    dispatch(addCurrentId(id));
  };

  const hideModal = () => setModalInfo({ type: null });
  const showModal = (type, item = null) => setModalInfo({ type, item });
  useSelector((state) => {
    console.log(state);
  });
  const activeChannelID = useSelector((state) => state.channels.currentChannelID);
  const channels = useSelector(channelsSelect.selectAll)
    .map((channel) => {
      if (channel.removable) {
        return (
          <li className="nav-item w-100" key={channel.id}>
            <Dropdown as={ButtonGroup} className="d-flex">
              <Button
                type="button"
                onClick={() => changeChannelHandle(channel.id)}
                className="w-100 text-start rounded-0"
                variant={activeChannelID === channel.id ? 'secondary' : null}
              >
                <span className="me-1">{`# ${channel.name}`}</span>

              </Button>
              <Dropdown.Toggle split variant={activeChannelID === channel.id ? 'secondary' : null} aria-expanded={activeChannelID === channel.id} id="dropdown-split-basic" className="fex-grow-0" />
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => showModal('delete', channel)} href="#">Удалить</Dropdown.Item>
                <Dropdown.Item onClick={() => showModal('renaming', channel)} href="#">Переименовать</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </li>
        );
      }
      return (
        <li className="nav-item w-100" key={channel.id}>
          <Button
            type="button"
            onClick={() => changeChannelHandle(channel.id)}
            className="w-100 text-start rounded-0"
            variant={activeChannelID === channel.id ? 'secondary' : null}
          >
            <span className="me-1">{`# ${channel.name}`}</span>

          </Button>
        </li>
      );
    });

  return (
    <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <b>Каналы</b>
        <Button type="button" onClick={() => showModal('adding')} className="text-primary p-0" variant="group-vertical">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            width="20"
            height="20"
            fill="currentColor"
          >
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
          <span className="visually-hidden">+</span>
        </Button>
      </div>
      <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
        {channels}
      </ul>
      {renderModal({ modalInfo, hideModal })}
    </div>
  );
};

export default LeftSideBar;
