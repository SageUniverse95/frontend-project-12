import { useFormik } from 'formik';
import {
  useRef, useEffect, useContext, useState,
} from 'react';
import * as Yup from 'yup';
import {
  Modal, FormGroup, FormControl, Button, Form,
} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { channelsSelect } from '../../slices/channelSlice.js';
import AppContext from '../../context/app.context.js';

const Add = (props) => {
  const { onHide } = props;
  const { socketApi } = useContext(AppContext);
  const [isValidate, setValidate] = useState(false);
  const nameOfChannels = useSelector(channelsSelect.selectAll)
    .map(({ name }) => name);

  const addValidationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов ')
      .required('Обязательное поле')
      .notOneOf(nameOfChannels, 'Название канала должо быть уникальным'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: addValidationSchema,
    validateOnChange: isValidate,
    validateOnBlur: isValidate,
    onSubmit: async (values) => {
      setValidate(true);
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
        <Form onSubmit={formik.handleSubmit}>
          <FormGroup>
            <FormControl
              ref={inputRef}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.errors.name ? 'mb-2 is-invalid' : 'mb-2'}
              value={formik.values.name}
              name="name"
            />
            {formik.errors.name ? <div className="invalid-feedback">{formik.errors.name}</div> : null}
          </FormGroup>
          <FormGroup className="d-flex justify-content-end">
            <Button type="button" onClick={onHide} className="me-2" variant="secondary">Отменить</Button>
            <Button type="submit" variant="primary">Отправить</Button>
          </FormGroup>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Add;
