import { useFormik } from 'formik';
import {
  useRef, useEffect, useContext, useState,
} from 'react';
import * as Yup from 'yup';
import {
  Modal, FormGroup, FormControl, Button,
} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { channelsSelect } from '../../slices/channelSlice.js';
import AppContext from '../../context/app.context';

const Rename = (props) => {
  const { onHide, item } = props;
  const { socketApi } = useContext(AppContext);
  const [isValidate, setValidate] = useState(false);
  const nameOfChannels = useSelector(channelsSelect.selectAll)
    .map(({ name }) => name);

  const renameValidationSchema = Yup.object().shape({
    body: Yup.string()
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов ')
      .required('Обязательное поле')
      .notOneOf(nameOfChannels, 'Название канала должо быть уникальным'),
  });

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
    validateOnChange: isValidate,
    validateOnBlur: isValidate,
    validationSchema: renameValidationSchema,
    onSubmit: async (values) => {
      const { body } = values;
      await socketApi.renameChannel({ id, name: body });
      setValidate(true);
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
              ref={inputRef}
              className={formik.errors.body ? 'mb-2 is-invalid' : 'mb-2'}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.body}
              data-testid="input-body"
              name="body"
            />
            {formik.errors.body ? <div className="invalid-feedback">{formik.errors.body}</div> : null}

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
