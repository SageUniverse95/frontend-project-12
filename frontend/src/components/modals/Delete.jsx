import { Modal, FormGroup, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import AppContext from '../../context/app.context';

const Delete = (props) => {
  const { t } = useTranslation();
  const { onHide, item } = props;
  const { socketApi } = useContext(AppContext);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const { id } = item;
      toast.success(t('notify.deleteChannel'));
      await socketApi.removingChannel({ id });
      onHide();
    } catch (error) {
      console.log(error);
      toast.warn('notify.errDeleteChannel');
    }
  };
  return (
    <Modal show>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{t('modalText.deleteChannelTitle')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="lead">{t('modalText.deleteChannelMessage')}</p>
        <form onSubmit={(e) => onSubmit(e)}>
          <FormGroup className="d-flex justify-content-end">
            <Button onClick={onHide} className="me-2" variant="secondary" type="button">{t('buttons.cancelBtn')}</Button>
            <Button type="submit" variant="danger">{t('buttons.deleteBtn')}</Button>
          </FormGroup>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default Delete;
