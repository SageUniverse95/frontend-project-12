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

const Rename = (props) => {
  const { t } = useTranslation();
  const { onHide, item } = props;
  const { doSocketAction } = useContext(SocketApiContext);
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
      try {
        const { body } = values;
        await doSocketAction({ id, name: body }, 'renameChannel');
        toast.success(t('notify.renameChannel'));
        setValidate(true);
        onHide();
      } catch (error) {
        setValidate(false);
        toast.warn('notify.errRenameChannel');
        throw error;
      }
    },
  });

  return (
    <Modal show>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{t('modalText.renameChannelTitle')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <FormGroup>
            <FormControl
              ref={inputRef}
              className={formik.errors.body ? 'mb-2 is-invalid' : 'mb-2'}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.body}
              id="body"
              name="body"
            />
            {formik.errors.body ? <div className="invalid-feedback">{formik.errors.body}</div> : null}
            <Form.Label className="visually-hidden" htmlFor="body">Имя канала</Form.Label>
          </FormGroup>
          <FormGroup className="d-flex justify-content-end">
            <Button type="button" onClick={onHide} className="me-2" variant="secondary">{t('buttons.cancelBtn')}</Button>
            <Button type="submit" variant="primary">{t('buttons.renameBtn')}</Button>
          </FormGroup>

        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Rename;
