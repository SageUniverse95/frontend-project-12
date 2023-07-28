import Header from '../components/Header.jsx';

const NotFoundPage = () => (
  <div className="h-100">
    <div className="d-flex flex-column h-100">
      <Header />
      <div className="text-center">
        <img alt="Страница не найдена" className="img-fluid h-25" src="./notFoundImg.svg" />
        <h1 className="h4 text-muted">Страница не найдена</h1>
        <p className="text-muted">
          Но вы можете перейти
          {' '}
          {' '}
          <a href="/">на главную страницу</a>
        </p>
      </div>
    </div>
  </div>

);

export default NotFoundPage;
