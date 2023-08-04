import { useFormik } from 'formik';
import { useRef, useEffect, useContext } from 'react';
import {
  Modal, FormGroup, FormControl, Button,
} from 'react-bootstrap';
import AppContext from '../../context/app.context.js';

const Add = (props) => {
  const { onHide } = props;
  const { socketApi } = useContext(AppContext);
  const formik = useFormik({
    initialValues: {
      name: '',
    },
    onSubmit: async (values) => {
      await socketApi.addNewChannel(values);
      onHide();
    },
  });

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <Modal show>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>Добавить канал</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={formik.handleSubmit}>
          <FormGroup>
            <FormControl
              required
              ref={inputRef}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mb-2"
              value={formik.values.name}
              name="name"
            />
          </FormGroup>
          <FormGroup className="d-flex justify-content-end">
            <Button type="button" onClick={onHide} className="me-2" variant="secondary">Отменить</Button>
            <Button type="submit" variant="primary">Отправить</Button>
          </FormGroup>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default Add;
