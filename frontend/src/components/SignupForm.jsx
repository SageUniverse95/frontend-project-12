import { useFormik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as Yup from 'yup';
import {
  useRef, useEffect, useState, useContext,
} from 'react';
import routes from '../routes';
import AppContext from '../context/auth.context.js';

const SignUpForm = () => {
  const { t } = useTranslation();
  const { logIn } = useContext(AppContext);
  const navigate = useNavigate();
  const inputUser = useRef();
  const [isFailSingUp, setSingUpFailed] = useState(false);
  const singUpValidSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов')
      .required('Обязательное поле'),
    password: Yup.string()
      .min(6, 'Не менее 6 символов')
      .required('Обязательное поле'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Пароли должны совпадать'),
  });
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: singUpValidSchema,
    onSubmit: async (values, { resetForm }) => {
      setSingUpFailed(false);
      try {
        const { username, password } = values;
        const resp = await axios.post(routes.getCreateNewUserPath(), { username, password });
        const token = resp.data;

        localStorage.setItem('userId', JSON.stringify(token));
        logIn();
        navigate('/');
        resetForm();
      } catch (error) {
        if (error.isAxiosError && error.response.status === 409) {
          console.log(error);
          inputUser.current.focus();
          inputUser.current.select();
        }
        setSingUpFailed(true);
      }
    },
  });

  useEffect(() => {
    inputUser.current.focus();
  }, []);

  return (
    <Form className="w-50" onSubmit={formik.handleSubmit}>
      <fieldset disabled={formik.isSubmitting}>
        <h1 className="text-center mb-4">{t('singUpFormText.mainTitle')}</h1>
        <Form.Group className="form-floating mb-3">
          <Form.Control
            onChange={formik.handleChange}
            value={formik.values.username}
            placeholder="От 3 до 20 символов"
            required
            className={formik.errors.username && formik.touched.username ? 'is-invalid' : ''}
            ref={inputUser}
            onBlur={formik.handleBlur}
            name="username"
            isInvalid={isFailSingUp}
            id="username"
            autoComplete="username"
          />
          <Form.Label htmlFor="username">{t('singUpFormText.userName')}</Form.Label>
          {formik.touched.username && formik.errors.username ? (<div className="invalid-tooltip">{formik.errors.username}</div>) : null}
        </Form.Group>
        <Form.Group className="form-floating mb-3">
          <Form.Control
            onChange={formik.handleChange}
            value={formik.values.password}
            onBlur={formik.handleBlur}
            required
            isInvalid={isFailSingUp}
            type="password"
            className={formik.errors.password && formik.touched.password ? 'is-invalid' : ''}
            placeholder="Пароль"
            autoComplete="current-password"
            name="password"
            id="password"
          />
          <Form.Label htmlFor="password">{t('singUpFormText.passwordMsg')}</Form.Label>
          {formik.touched.password && formik.errors.password ? (<div className="invalid-tooltip">{formik.errors.password}</div>) : null}
        </Form.Group>
        <Form.Group className="form-floating mb-3">
          <Form.Control
            onChange={formik.handleChange}
            required
            isInvalid={isFailSingUp}
            value={formik.values.confirmPassword}
            placeholder="Подтвердите пароль"
            autoComplete="current-password"
            className={formik.errors.confirmPassword ? 'is-invalid' : ''}
            type="password"
            onBlur={formik.handleBlur}
            name="confirmPassword"
            id="confirmPassword"
          />
          <Form.Label htmlFor="confirmPassword">{t('singUpFormText.confirmPassword')}</Form.Label>
          {formik.errors.confirmPassword ? <div className="invalid-tooltip">{formik.errors.confirmPassword}</div> : null}
          {isFailSingUp ? (<div className="invalid-tooltip">Такой пользователь уже существует</div>) : null}
        </Form.Group>
        <Button className="w-100 mb-3" variant="outline-primary" type="submit">{t('buttons.signUpBtn')}</Button>
      </fieldset>
    </Form>
  );
};

export default SignUpForm;
