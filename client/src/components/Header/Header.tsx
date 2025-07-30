import { Link } from 'react-router-dom';
import logo from '../../assets/template_assets/images/custom/logo.png';
import { useAuth } from '../../context/AuthContext';
import { logOut } from '../../services/login.service';
import { useEffect, useState, useRef } from 'react';
import { FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import { useModal } from '../../context/ModalContext';
import ConfirmationModal from '../shared/ConfirmationModal';

const Header: React.FC = () => {
  const { isLogged, setIsLogged, employee, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 992);
  const [isSticky, setIsSticky] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { openModal, closeModal } = useModal();
  const headerRef = useRef<HTMLElement>(null);

  const toggleMenu = (shouldClose = false) => {
    setIsOpen(prev => shouldClose ? false : !prev);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 992);
      if (window.innerWidth >= 992) {
        setIsOpen(false); // reset mobile menu on desktop
      }
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 0) {
        // At the top of the page - always show header
        setIsSticky(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px - hide header
        setIsSticky(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show sticky header
        setIsSticky(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const logOutHandler = (e: React.MouseEvent) => {
    e?.preventDefault?.();
    setShowLogoutModal(true);
    openModal();
  };

  const handleConfirmLogout = () => {
    logOut();
    setIsLogged(false);
    closeModal();
    setShowLogoutModal(false);
  };
  
  const handleCloseModal = () => {
    closeModal();
    setShowLogoutModal(false);
  };

  return (
    <header
      ref={headerRef}
      className={`main-header header-style-one bg-white ${
        isSticky ? 'sticky' : ''
      }`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: 'transform 0.3s ease-in-out',
        transform: isSticky ? 'translateY(0)' : 'translateY(-100%)',
      }}
    >
      {/* Header Top */}
      <div className="header-top">
        <div className="auto-container">
          <div className="inner-container">
            <div className="left-column">
              <div className="text">
                Your Trusted Partner in Automotive Care
              </div>
              <div className="office-hour">
                Opening Hours: Monday - Saturday 7:00AM - 6:00PM
              </div>
            </div>
            <div className="right-column">
              {isLogged ? (
                <div className="link-btn mr-5">
                  <div className="phone-number">
                    <strong>Welcome: {employee?.employee_first_name}</strong>
                  </div>
                </div>
              ) : (
                <div className="phone-number">
                  Schedule Your Appointment Today:{' '}
                  <strong>+251 911 111 111</strong>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="header-upper">
        <div className="auto-container">
          <div className="inner-container">
            <div className="logo-box">
              <div className="logo">
                <Link to="/">
                  <img src={logo} alt="" title="" />
                </Link>
              </div>
            </div>
            <div className="right-column">
              {/* Nav Box */}
              <div className="nav-outer">
                {/* Mobile Navigation Toggler */}
                {!isDesktop && (
                  <button
                    className="navbar-toggler d-lg-none"
                    onClick={() => toggleMenu()}
                    aria-expanded={isOpen}
                    aria-label="Toggle navigation"
                    type="button"
                  >
                    {isOpen ? (
                      <FaTimes color="black" />
                    ) : (
                      <FaBars color="black" />
                    )}
                  </button>
                )}

                {/* Main Menu */}
                <nav
                  className={`main-menu navbar-expand-md navbar-light ${
                    isOpen ? 'show' : ''
                  }`}
                >
                  <div
                    className={`navbar-collapse clearfix ${
                      isOpen ? 'show' : 'collapse'
                    }`}
                    id="navbarSupportedContent"
                  >
                    <ul className="navigation">
                      <li className="dropdown">
                        <Link
                          to="/"
                          onClick={() => !isDesktop && toggleMenu(true)}
                        >
                          Home
                        </Link>
                      </li>
                      <li className="dropdown">
                        <Link
                          to="/about"
                          onClick={() => !isDesktop && toggleMenu(true)}
                        >
                          About Us
                        </Link>
                      </li>
                      <li className="dropdown">
                        <Link
                          to="/service"
                          onClick={() => !isDesktop && toggleMenu(true)}
                        >
                          Services
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/contact"
                          onClick={() => !isDesktop && toggleMenu(true)}
                        >
                          Contact Us
                        </Link>
                      </li>
                      {isAdmin && (
                        <li className="dropdown">
                          <Link
                            to="/admin"
                            onClick={() => !isDesktop && toggleMenu(true)}
                          >
                            Admin
                          </Link>
                        </li>
                      )}
                    </ul>
                  </div>
                </nav>
              </div>
              <div className="search-btn"></div>
              <div className="link-btn">
                <Link
                  to={!isLogged ? 'login' : ''}
                  className="theme-btn btn-style-one"
                  onClick={isLogged ? logOutHandler : undefined}
                >
                  {!isLogged ? (
                    'Login'
                  ) : (
                    <>
                      <FaSignOutAlt /> Log Out
                    </>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Header Upper */}

      {/* Sticky Header  */}
      {!isDesktop && (
        <div className="header-main d-flex flex-column justify-content-between align-items-center container py-2">
          <nav
            className={`main-nav list-group ${
              isDesktop || isOpen ? 'show' : 'collapse'
            }`}
            style={{ width: '100%' }}
          >
            <Link
              to="/"
              className="list-group-item list-group-item-action"
              onClick={() => toggleMenu(true)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="list-group-item list-group-item-action"
              onClick={() => toggleMenu(true)}
            >
              About Us
            </Link>
            <Link
              to="/service"
              className="list-group-item list-group-item-action"
              onClick={() => toggleMenu(true)}
            >
              Services
            </Link>
            <Link
              to="/contact"
              className="list-group-item list-group-item-action"
              onClick={() => toggleMenu(true)}
            >
              Contact Us
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="list-group-item list-group-item-action"
                onClick={() => toggleMenu(true)}
              >
                Admin
              </Link>
            )}
            {isLogged ? (
              <button
                className="list-group-item list-group-item-action text-center w-100 border-0 theme-btn btn-style-one"
                onClick={(e) => {
                  e.preventDefault();
                  logOutHandler(e);
                }}
              >
                <FaSignOutAlt className="me-2" /> Log Out
              </button>
            ) : (
              <Link
                to="/login"
                className="list-group-item list-group-item-action theme-btn btn-style-one text-center"
                onClick={() => toggleMenu(true)}
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
      {/* End Sticky Menu */}

      <div className="nav-overlay">
        <div className="cursor"></div>
        <div className="cursor-follower"></div>
      </div>

      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        confirmText="Log Out"
        icon={<FaSignOutAlt />}
        confirmColor="#e63946"
      />
    </header>
  );
}

export default Header;
