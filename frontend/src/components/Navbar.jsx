import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <div className="brand-icon">🔥</div>
          HN<span>Daily</span>
        </Link>

        <div className="navbar-nav">
          <NavLink to="/" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} end>
            Stories
          </NavLink>

          {user && (
            <NavLink to="/bookmarks" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              Bookmarks
            </NavLink>
          )}

          {user ? (
            <>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', padding: '0 4px' }}>
                👤 {user.username}
              </span>
              <button className="btn-nav-ghost" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-nav-ghost">Login</Link>
              <Link to="/register" className="btn-nav-primary">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
