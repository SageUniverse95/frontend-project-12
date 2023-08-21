import { Button, Dropdown, ButtonGroup } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { channelsSelect, addCurrentId } from '../slices/channelSlice';
import getModal from './modals/choiceModal.js';
import getCurrentId from '../selectors/selector.js';
import Svg from './svg/SvgLeftSideBar';

const renderModal = ({ modalInfo, hideModal }) => {
  if (!modalInfo.type) {
    return null;
  }

  const Component = getModal(modalInfo.type);
  return <Component modalInfo={modalInfo} onHide={hideModal} item={modalInfo.item} />;
};

const LeftSideBar = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [modalInfo, setModalInfo] = useState({ type: null, item: null });

  const changeChannelHandle = (id) => {
    dispatch(addCurrentId(id));
  };

  const hideModal = () => setModalInfo({ type: null });
  const showModal = (type, item = null) => setModalInfo({ type, item });

  const activeChannelID = useSelector(getCurrentId);
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
                variant={activeChannelID === channel.id ? 'secondary' : ''}
              >
                <span className="me-1">{`# ${channel.name}`}</span>

              </Button>
              <Dropdown.Toggle split variant={activeChannelID === channel.id ? 'secondary' : ''} aria-expanded={activeChannelID === channel.id} id="dropdown-split-basic" className="fex-grow-0">
                <span className="visually-hidden">Управление каналом</span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => showModal('delete', channel)} href="#">{t('buttons.deleteBtn')}</Dropdown.Item>
                <Dropdown.Item onClick={() => showModal('renaming', channel)} href="#">{t('buttons.renameBtn')}</Dropdown.Item>
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
            variant={activeChannelID === channel.id ? 'secondary' : ''}
          >
            <span className="me-1">{`# ${channel.name}`}</span>

          </Button>
        </li>
      );
    });

  return (
    <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <b>{t('leftSideBar.titleChannel')}</b>
        <Button type="button" onClick={() => showModal('adding')} className="text-primary p-0" variant="group-vertical">
          <Svg />
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
