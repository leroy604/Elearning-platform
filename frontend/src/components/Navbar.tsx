import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="glass navbar">
      <div className="navbar-inner">
        <div className="navbar-row">
          {/* Logo */}
          <Link to="/" className="navbar-brand" aria-label="LearnHub Home">
            <div className="navbar-mark" aria-hidden="true">
              <span className="navbar-mark-letter">E</span>
            </div>
            <span className="navbar-title">LearnHub</span>
          </Link>

          {/* Navigation Links */}
          <div className="navbar-links">
            <Link
              to="/"
              className="navbar-link"
            >
              Courses
            </Link>

            {isAuthenticated && (
              <>
                <Link to="/profile" className="navbar-link">
                  My Learning
                </Link>
                <Link to="/instructor-dashboard" className="navbar-link text-blue-400 font-bold hover:text-blue-300">
                  Teach
                </Link>
              </>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="navbar-actions">
            {isAuthenticated ? (
              <div className="navbar-auth">
                <span className="navbar-welcome">
                  Welcome, {user?.firstName || 'User'}
                </span>
                <button
                  onClick={handleLogout}
                  className="navbar-btn navbar-btn-danger"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="navbar-btn navbar-btn-primary"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;