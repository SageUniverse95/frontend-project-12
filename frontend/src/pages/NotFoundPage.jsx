import { useTranslation } from 'react-i18next';
import Header from '../components/Header.jsx';

const NotFoundPage = () => {
  const { t } = useTranslation();
  return (
    <div className="h-100">
      <div className="d-flex flex-column h-100">
        <Header />
        <div className="text-center">
          <img alt="Страница не найдена" className="img-fluid h-25" src="./notFoundImg.svg" />
          <h1 className="h4 text-muted">{t('notFoundPage.notFoundMessage')}</h1>
          <p className="text-muted">
            {t('notFoundPage.altMessage')}
            {' '}
            {' '}
            <a href="/">{t('notFoundPage.mainPageMessage')}</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
