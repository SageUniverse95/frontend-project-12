import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  const { t } = useTranslation();
  return (
    <div className="h-100">
      <div className="d-flex flex-column h-100">
        <Header />
        <div className="container-fluid h-100">
          <div className="row justify-content-center align-content-center h-100">
            <div className="col-12 col-md-8 col-xxl-6">
              <div className="card shadow-sm">
                <div className="card-body row p-5">
                  <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                    <img className="rounded-circle" alt="Войти" src="./LoginLogo.jpeg" />
                  </div>
                  <LoginForm />
                </div>
                <div className="card-footer p-4">
                  <div className="text-center">
                    <span>{t('logInFormText.noAccMessage')}</span>
                    {' '}
                    {' '}
                    <a href="/singup">{t('logInFormText.singUpMessage')}</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
