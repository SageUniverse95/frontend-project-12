import { Modal, FormGroup, Button } from 'react-bootstrap';
import { useContext } from 'react';
import AppContext from '../../context/app.context';

const Delete = (props) => {
  const { onHide, item } = props;
  const { socketApi } = useContext(AppContext);

  const onSubmit = async (e) => {
    e.preventDefault();
    const { id } = item;
    await socketApi.removingChannel({ id });

    onHide();
  };
  return (
    <Modal show>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>Удалить канал</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="lead">Уверены?</p>
        <form onSubmit={(e) => onSubmit(e)}>
          <FormGroup className="d-flex justify-content-end">
            <Button onClick={onHide} className="me-2" variant="secondary" type="button">Отменить</Button>
            <Button type="submit" variant="danger">Удалить</Button>
          </FormGroup>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default Delete;
