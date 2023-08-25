import { useFormik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import {
  useContext, useState, useRef, useEffect,
} from 'react';
import routesPath from '../routesPath.js';
import AuthContext from '../context/authContext.js';

const LoginForm = () => {
  const [isFailAuth, setAuthFailed] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { logIn } = useContext(AuthContext);
  const inputWithLogin = useRef();
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async (values) => {
      setAuthFailed(false);
      try {
        const resp = await axios.post(routesPath.getLoginPath(), values);
        logIn(resp.data);
        navigate('/');
      } catch (error) {
        formik.setSubmitting(false);
        if (error.isAxiosError && error.response.status === 401) {
          inputWithLogin.current.select();
        }
        setAuthFailed(true);
        throw error;
      }
    },
  });

  useEffect(() => {
    inputWithLogin.current.focus();
  }, []);

  return (
    <Form className="col-12 col-md-6 mt-3 mt-mb-0" onSubmit={formik.handleSubmit}>
      <fieldset disabled={formik.isSubmitting}>
        <h1 className="text-center mb-4">{t('logInFormText.mainTitle')}</h1>
        <Form.Group className="form-floating mb-3">
          <Form.Control
            onChange={formik.handleChange}
            value={formik.values.username}
            placeholder="Ваш логин"
            required
            name="username"
            id="username"
            autoComplete="username"
            ref={inputWithLogin}
            isInvalid={isFailAuth}
          />
          <Form.Label htmlFor="username">{t('logInFormText.nickName')}</Form.Label>
        </Form.Group>
        <Form.Group className="form-floating mb-4">
          <Form.Control
            onChange={formik.handleChange}
            type="password"
            value={formik.values.password}
            placeholder="Ваш пароль"
            name="password"
            id="password"
            autoComplete="current-password"
            isInvalid={isFailAuth}
            required
          />
          <Form.Label htmlFor="password">{t('logInFormText.passwordMsg')}</Form.Label>
          <Form.Control.Feedback className="invalid-tooltip">Неверные имя пользователя или пароль</Form.Control.Feedback>
        </Form.Group>
        <Button className="w-100 mb-3" variant="outline-primary" type="submit">{t('buttons.loginBtn')}</Button>
      </fieldset>
    </Form>
  );
};

export default LoginForm;
