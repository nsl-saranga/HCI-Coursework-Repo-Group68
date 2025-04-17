import React from 'react';
import '../Footer/Footer.css';

const Footer = () => {
  return (
    <footer className="footer" id="contact">
      <div className="section__container footer__container">
        <div className="footer__col">
          <div className="footer__logo">
            <a href="#" className="logo">furni.shop</a>
          </div>
          <p>
            Join us in transforming your living spaces with furniture that
            blends elegance and practicality seamlessly.
          </p>
          <ul className="footer__socials">
            <li>
              <a href="#"><i className="ri-facebook-fill"></i></a>
            </li>
            <li>
              <a href="#"><i className="ri-twitter-fill"></i></a>
            </li>
            <li>
              <a href="#"><i className="ri-linkedin-fill"></i></a>
            </li>
            <li>
              <a href="#"><i className="ri-pinterest-fill"></i></a>
            </li>
          </ul>
        </div>
        <div className="footer__col">
          <h4>Services</h4>
          <ul className="footer__links">
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Press</a></li>
            <li><a href="#">Payrol</a></li>
            <li><a href="#">Library</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Help Center</a></li>
          </ul>
        </div>
        <div className="footer__col">
          <h4>Resources</h4>
          <ul className="footer__links">
            <li><a href="#">Pricing</a></li>
            <li><a href="#">FAQs</a></li>
            <li><a href="#">Contact Support</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms</a></li>
          </ul>
        </div>
        <div className="footer__col">
          <h4>Support</h4>
          <ul className="footer__links">
            <li><a href="#">Contact</a></li>
            <li><a href="#">Affiliates</a></li>
            <li><a href="#">Sitemap</a></li>
            <li><a href="#">Cancelation Policy</a></li>
            <li><a href="#">Security</a></li>
          </ul>
        </div>
      </div>
      <div className="footer__bar">
        Copyright © 2024 Web Design Mastery. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
