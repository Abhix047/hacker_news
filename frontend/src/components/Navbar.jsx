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
          <div className="brand-icon">⚡</div>
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
              <span style={{
                fontSize: '0.8rem',
                color: 'var(--accent)',
                fontWeight: 600,
                padding: '4px 12px',
                borderRadius: '100px',
                background: 'var(--accent-glow)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}>
                ✦ {user.username}
              </span>
              <button className="btn-nav-ghost" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-nav-ghost">Sign In</Link>
              <Link to="/register" className="btn-nav-primary">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
