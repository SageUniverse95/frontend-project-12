import { Modal, FormGroup, Button } from 'react-bootstrap';

const Delete = (props) => {
  const { onHide } = props;

  return (
    <Modal show>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>Удалить канал</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="lead">Уверены?</p>
        <form>
          <FormGroup className="d-flex justify-content-end">
            <Button onClick={onHide} className="me-2" variant="secondary" type="button">Отменить</Button>
            <Button type="button" variant="danger">Удалить</Button>
          </FormGroup>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default Delete;
