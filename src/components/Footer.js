import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer = () => {
  return (
    <footer className="bg-light text-center text-lg-start">
      <div className="container p-4">
        <div className="row">
          <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
            <h5 className="text-uppercase">Products</h5>
            <ul className="list-unstyled mb-0">
              <li>
                <a href="#!" className="text-dark">Product 1</a>
              </li>
              <li>
                <a href="#!" className="text-dark">Product 2</a>
              </li>
              <li>
                <a href="#!" className="text-dark">Product 3</a>
              </li>
            </ul>
          </div>
          <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
            <h5 className="text-uppercase">Resources</h5>
            <ul className="list-unstyled mb-0">
              <li>
                <a href="#!" className="text-dark">Resource 1</a>
              </li>
              <li>
                <a href="#!" className="text-dark">Resource 2</a>
              </li>
              <li>
                <a href="#!" className="text-dark">Resource 3</a>
              </li>
            </ul>
          </div>
          <div className="col-lg-4 col-md-12 mb-4 mb-md-0">
            <h5 className="text-uppercase">Get in touch</h5>
            <ul className="list-unstyled mb-0">
              <li>
                <a href="#!" className="text-dark">Contact Us</a>
              </li>
              <li>
                <a href="#!" className="text-dark">Support</a>
              </li>
              <li>
                <a href="#!" className="text-dark">Feedback</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="text-center p-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
        © 2024 PRO Tracker
      </div>
    </footer>
  );
};

export default Footer;
