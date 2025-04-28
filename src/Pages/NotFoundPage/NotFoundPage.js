import React from 'react';
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';
import { Link } from 'react-router-dom';
import '../NotFoundPage/NotFoundPage.css'; // New CSS import

const NotFound = () => {
  return (
    <>
      <NavBar />

      <section className="notfound__container">
        <div className="notfound__content">
          <h1 className="notfound__title">404</h1>
          <h2 className="notfound__subtitle">Oops! Page Not Found</h2>
          <p className="notfound__message">
            The page you are looking for might have been removed, had its name changed,
            or is temporarily unavailable.
          </p>
          <Link to="/" className="notfound__btn">
            Return to Homepage
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default NotFound;