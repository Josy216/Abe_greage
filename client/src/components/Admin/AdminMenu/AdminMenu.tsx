import { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { adminLinks } from '../../../util';

const AdminMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 992);

  const toggleMenu = (shouldClose?: boolean) => {
    if (typeof shouldClose === 'boolean') {
      setIsOpen(!shouldClose);
    } else {
      setIsOpen((prev) => !prev);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 992);
      if (window.innerWidth >= 992) {
        setIsOpen(false); // reset mobile menu on desktop
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="admin-sidebar">
      <div className="admin-menu-header d-flex justify-content-between align-items-center admin-menu">
        <h2>Admin Menu</h2>
        {!isDesktop && (
          <button
            className="navbar-toggler d-lg-none"
            onClick={() => toggleMenu()}
            aria-expanded={isOpen}
            aria-label="Toggle navigation"
          >
            {isOpen ? <FaTimes color="white" /> : <FaBars color="white" />}
          </button>
        )}
      </div>

      <div
        className={`list-group ${isDesktop || isOpen ? 'show' : 'collapse'}`}
        id="adminMenuCollapse"
      >
        {adminLinks.map(({ path, label }) => (
          <NavLink
            key={path}
            to={path}
            className="list-group-item list-group-item-action"
            onClick={() => !isDesktop && toggleMenu(true)}
          >
            {label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default AdminMenu;
