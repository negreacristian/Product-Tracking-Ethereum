import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Footer = () => {
  return (
    <footer className="bg-light text-center text-lg-start">
      <div className="container p-4">
        <div className="row">
          <div className="col-lg-4 col-md-6 mb-4 mb-md-0 text-center">
            <h5 className="text-uppercase">Contact us</h5>
            <ul className="list-unstyled mb-0">
              <li>
                <a href="mailto:cristian.negrea02@e-uvt.ro" className="text-dark">Email: cristian.negrea02@e-uvt.ro</a>
              </li>
              <li>
                <a href="tel:+40758182654" className="text-dark">Phone: +40758 182 654</a>
              </li>
              <li>
                <a href="https://goo.gl/maps/xyz" target="_blank" rel="noopener noreferrer" className="text-dark">Address: Calea Martirilor 1989, Timisoara, Romania</a>
              </li>
            </ul>
          </div>
          <div className="col-lg-4 col-md-6 mb-4 mb-md-0 text-center">
            <h5 className="text-uppercase">Follow Us</h5>
            <div className="social-icons">
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-dark me-3">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="https://www.github.com" target="_blank" rel="noopener noreferrer" className="text-dark me-3">
                <i className="fab fa-github"></i>
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-dark">
                <i className="fab fa-facebook"></i>
              </a>
            </div>
          </div>
          <div className="col-lg-4 col-md-12 mb-4 mb-md-0 text-center">
            <h5 className="text-uppercase">Quick Links</h5>
            <ul className="list-unstyled mb-0">
              <li><a href="/about" className="text-dark">About Us</a></li>
              <li><a href="/contact" className="text-dark">Contact</a></li>
              <li><a href="/privacy-policy" className="text-dark">Privacy Policy</a></li>
              <li><a href="/terms-of-service" className="text-dark">Terms of Service</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="text-center p-3" style={{ backgroundColor: '#272727', color:'#457D58', fontWeight:'bold' }}>
        © 2024 PROduct Guard
      </div>
    </footer>
  );
};

export default Footer;
