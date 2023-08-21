import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import {
  useRef, useEffect, useContext, useState,
} from 'react';
import * as Yup from 'yup';
import {
  Modal, FormGroup, FormControl, Button, Form,
} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { channelsSelect } from '../../slices/channelSlice.js';
import SocketApiContext from '../../context/socketApiContext.js';

const Add = (props) => {
  const { t } = useTranslation();
  const { onHide } = props;
  const { doSocketAction } = useContext(SocketApiContext);
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
      try {
        setValidate(true);
        await doSocketAction(values, 'newChannel');
        toast.success(t('notify.addChannel'));
        onHide();
      } catch (error) {
        console.log(error);
        toast.warn(t('notify.errAddChannel'));
      }
    },
  });

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <Modal show>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{t('modalText.addChannelTitle')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <FormGroup>
            <FormControl
              ref={inputRef}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.errors.name ? 'mb-2 is-invalid' : 'mb-2'}
              id="name"
              value={formik.values.name}
              name="name"
            />
            {formik.errors.name ? <div className="invalid-feedback">{formik.errors.name}</div> : null}
            <Form.Label className="visually-hidden" htmlFor="name">Имя канала</Form.Label>
          </FormGroup>
          <FormGroup className="d-flex justify-content-end">
            <Button type="button" onClick={onHide} className="me-2" variant="secondary">{t('buttons.cancelBtn')}</Button>
            <Button type="submit" variant="primary">{t('buttons.sendBtn')}</Button>
          </FormGroup>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Add;
