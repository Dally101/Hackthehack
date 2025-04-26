import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../features/auth/authActions';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const profileMenuRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  // Close profile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-white font-bold text-xl">Hack the Hackathon</span>
          </Link>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
        </div>
        
          {/* Desktop navigation */}
        <nav className="hidden md:flex space-x-6">
            <NavLink to="/" active={isActive('/')}>
            Home
            </NavLink>
            <NavLink to="/hackathons" active={isActive('/hackathons')}>
              Hackathons
            </NavLink>
            <NavLink to="/about" active={isActive('/about')}>
            About
            </NavLink>
            <NavLink to="/faq" active={isActive('/faq')}>
              FAQ
            </NavLink>
            {isAuthenticated && (
              <NavLink to="/dashboard" active={isActive('/dashboard')}>
                Dashboard
              </NavLink>
            )}
        </nav>
        
          <div className="hidden md:block">
            {isAuthenticated ? (
              <div className="relative" ref={profileMenuRef}>
                <button 
                  onClick={toggleProfileMenu}
                  className="flex items-center space-x-2 text-white hover:text-gray-200 focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span>{user?.name || 'User'}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link 
                      to="/dashboard" 
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setIsProfileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link to="/login" className="text-white hover:text-gray-200">
                  Sign In
          </Link>
                <Link to="/register" className="bg-white text-blue-600 hover:bg-gray-100 font-medium py-1 px-4 rounded-md">
                  Sign Up
          </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile navigation */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} mt-4 animate-fadeIn`}>
          <nav className="flex flex-col space-y-3">
            <MobileNavLink to="/" active={isActive('/')} onClick={toggleMenu}>
              Home
            </MobileNavLink>
            <MobileNavLink to="/hackathons" active={isActive('/hackathons')} onClick={toggleMenu}>
              Hackathons
            </MobileNavLink>
            <MobileNavLink to="/about" active={isActive('/about')} onClick={toggleMenu}>
              About
            </MobileNavLink>
            <MobileNavLink to="/faq" active={isActive('/faq')} onClick={toggleMenu}>
              FAQ
            </MobileNavLink>
            {isAuthenticated && (
              <MobileNavLink to="/dashboard" active={isActive('/dashboard')} onClick={toggleMenu}>
                Dashboard
              </MobileNavLink>
            )}
            
            {isAuthenticated ? (
              <>
                <MobileNavLink to="/profile" active={isActive('/profile')} onClick={toggleMenu}>
                  Profile
                </MobileNavLink>
                <button 
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="text-white text-left font-medium hover:bg-white/10 py-2 px-3 rounded-md w-full"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <MobileNavLink to="/login" active={isActive('/login')} onClick={toggleMenu}>
                  Sign In
                </MobileNavLink>
                <Link 
                  to="/register" 
                  className="bg-white text-blue-600 font-semibold py-2 px-4 rounded-md w-full text-center"
                  onClick={toggleMenu}
                >
                  Sign Up
            </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

// Desktop navigation link
function NavLink({ to, active, children }) {
  return (
    <Link
      to={to}
      className={`text-white font-medium hover:text-gray-200 transition-colors ${
        active ? 'border-b-2 border-white' : ''
      }`}
    >
      {children}
    </Link>
  );
}

// Mobile navigation link
function MobileNavLink({ to, active, onClick, children }) {
  return (
    <Link
      to={to}
      className={`text-white font-medium hover:text-gray-200 transition-colors ${
        active ? 'bg-white/10 rounded-md' : ''
      } py-2 px-3`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}

export default Header;
