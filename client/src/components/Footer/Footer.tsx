import { Link } from 'react-router-dom';
import logoTwo from '../../assets/template_assets/images/logo-two.png';

const Footer: React.FC = () => {
  return (
    <footer className="main-footer">
      {/* Upper Box */}
      <div className="upper-box">
        <div className="auto-container">
          <div className="row no-gutters">
            {/* Footer Info Box */}
            <div className="footer-info-box col-md-4 col-sm-6 col-xs-12">
              <div className="info-inner">
                <div className="content">
                  <div className="icon">
                    <span className="flaticon-pin"></span>
                  </div>
                  <div className="text">
                    Bole Sub-City, <br /> Addis Ababa, Ethiopia
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Info Box */}
            <div className="footer-info-box col-md-4 col-sm-6 col-xs-12">
              <div className="info-inner">
                <div className="content">
                  <div className="icon">
                    <span className="flaticon-email"></span>
                  </div>
                  <div className="text">
                    Email us : <br />{' '}
                    <a href="mailto:abegarage@email.com">
                      abegarage@email.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Info Box */}
            <div className="footer-info-box col-md-4 col-sm-6 col-xs-12">
              <div className="info-inner">
                <div className="content">
                  <div className="icon">
                    <span className="flaticon-phone"></span>
                  </div>
                  <div className="text">
                    Call us on : <br />
                    <strong>+251 911 111 111</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Widgets Section */}
      <div className="widgets-section">
        <div className="auto-container">
          <div className="widgets-inner-container">
            <div className="row clearfix">
              {/* Footer Column */}
              <div className="footer-column col-lg-4">
                <div className="widget widget_about">
                  <div className="logo">
                    <a href="index.html">
                      <img src={logoTwo} alt="" title="" />
                    </a>
                  </div>
                  <div className="text">
                    Abe's Garage is your trusted partner for all automotive needs. We are dedicated to providing top-quality service and customer satisfaction.
                  </div>
                </div>
              </div>

              {/* Footer Column */}
              <div className="footer-column col-lg-4">
                <div className="row">
                  <div className="col-md-6">
                    <div className="widget widget_links">
                      <h4 className="widget_title">Usefull Links</h4>
                      <div className="widget-content">
                        <ul className="list">
                          <li>
                            <Link to="/">Home</Link>
                          </li>
                          <li>
                            <Link to="/about">About Us</Link>
                          </li>
                          <li>
                            <Link to="/services">Services</Link>
                          </li>
                          <li>
                            <Link to="/about">About</Link>
                          </li>
                          <li>
                            <Link to="/contact">Contact</Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="widget widget_links">
                      <h4 className="widget_title">Our Services</h4>
                      <div className="widget-content">
                        <ul className="list">
                          <li>
                            <Link to="/services">Performance Upgrade</Link>
                          </li>
                          <li>
                            <Link to="/services">Transmission Service</Link>
                          </li>
                          <li>
                            <Link to="/services">Break Repair & Service</Link>
                          </li>
                          <li>
                            <Link to="/services">Engine Service & Repair</Link>
                          </li>
                          <li>
                            <Link to="/services">Trye & Wheels</Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Column */}
              <div className="footer-column col-lg-4">
                <div className="widget widget_newsletter">
                  <h4 className="widget_title">Social Media Links</h4>
                  <div className="text">Get latest updates and offers.</div>
                  <ul className="social-links">
                    <li>
                      <a href="https://www.facebook.com/abe">
                        <span className="fab fa-facebook-f"></span>
                      </a>
                    </li>
                    <li>
                      <a href="https://www.linkedin.com/company/abe-garage">
                        <span className="fab fa-linkedin-in"></span>
                      </a>
                    </li>
                    <li>
                      <a href="https://twitter.com/abe">
                        <span className="fab fa-twitter"></span>
                      </a>
                    </li>
                    <li>
                      <a href="https://www.instagram.com/abe_garage/">
                        <span className="fab fa-instagram"></span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="auto-container">
        <div className="footer-bottom">
          <div className="copyright-text">
            © Copyright <a href="#">Abe's Garage</a> 2025. All rights reserved.
          </div>
          <div className="text">
            Designed by <a href="https://www.evangadi.com" target="_blank" rel="noopener noreferrer">Evangadi</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
