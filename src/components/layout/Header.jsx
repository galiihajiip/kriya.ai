import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useStore from '../../store/useStore';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useStore();

  const navigation = [
    { name: 'Home', path: '/' },
    { name: 'Jelajah Motif', path: '/explore' },
    { name: 'Edukasi', path: '/education' },
    { name: 'Jual Kriya', path: '/upload' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-[#403F2E] text-white sticky top-0 z-50 shadow-lg">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold" style={{ fontFamily: 'Merriweather, serif' }}>
              KRIYA<span className="text-[#F8C471]">.AI</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`transition-colors hover:text-[#F8C471] ${
                  isActive(item.path) ? 'text-[#F8C471] font-semibold' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Auth Section */}
            <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-500">
              {isAuthenticated ? (
                <>
                  <span className="text-sm">Halo, {user?.name || 'User'}</span>
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="px-4 py-2 bg-[#F8C471] text-[#403F2E] rounded-md hover:bg-[#f0b854] transition-colors font-medium"
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="px-4 py-2 border border-white rounded-md hover:bg-white hover:text-[#403F2E] transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 bg-[#F8C471] text-[#403F2E] rounded-md hover:bg-[#f0b854] transition-colors font-medium"
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-600">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block py-2 transition-colors hover:text-[#F8C471] ${
                  isActive(item.path) ? 'text-[#F8C471] font-semibold' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t border-gray-600">
              {isAuthenticated ? (
                <>
                  <p className="text-sm mb-2">Halo, {user?.name || 'User'}</p>
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="block py-2 text-[#F8C471]"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard Admin
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full mt-2 px-4 py-2 border border-white rounded-md hover:bg-white hover:text-[#403F2E] transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block px-4 py-2 bg-[#F8C471] text-[#403F2E] rounded-md text-center hover:bg-[#f0b854] transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
