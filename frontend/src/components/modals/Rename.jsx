import { useFormik } from 'formik';
import { useRef, useEffect, useContext } from 'react';
import {
  Modal, FormGroup, FormControl, Button,
} from 'react-bootstrap';
import AppContext from '../../context/app.context';

const Rename = (props) => {
  const { onHide, item } = props;
  const { socketApi } = useContext(AppContext);
  const inputRef = useRef();
  const { id, name } = item;
  useEffect(() => {
    inputRef.current.focus();
    inputRef.current.select();
  }, []);

  const formik = useFormik({
    initialValues: {
      body: name,
    },
    onSubmit: async (values) => {
      const { body } = values;
      await socketApi.renameChannel({ id, name: body });
      onHide();
    },
  });

  return (
    <Modal show>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>Переименовать канал</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={formik.handleSubmit}>
          <FormGroup>
            <FormControl
              required
              ref={inputRef}
              className="mb-2"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.body}
              data-testid="input-body"
              name="body"
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

export default Rename;
