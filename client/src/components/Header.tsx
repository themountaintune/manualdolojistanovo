import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings, Plus, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-medium text-gray-900" style={{letterSpacing: '-0.02em'}}>ManualDolojista</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
              style={{letterSpacing: '-0.01em'}}
            >
              Início
            </Link>
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
              style={{letterSpacing: '-0.01em'}}
            >
              Artigos
            </Link>
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
              style={{letterSpacing: '-0.01em'}}
            >
              Sobre
            </Link>
          </nav>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {user?.role === 'ADMIN' || user?.role === 'EDITOR' ? (
                  <Link
                    to="/create-post"
                    className="btn btn-primary btn-sm flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>New Post</span>
                  </Link>
                ) : null}
                
                <div className="relative">
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary-600" />
                      </div>
                    )}
                    <span className="text-sm font-medium">{user?.username}</span>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      <Link
                        to="/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4 mr-3" />
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button
                onClick={() => {
                  const newsletterSection = document.getElementById('newsletter');
                  if (newsletterSection) {
                    newsletterSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="btn btn-primary btn-sm"
              >
                Inscrever-se
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              <Link
                to="/"
                className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Início
              </Link>
              <Link
                to="/"
                className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Artigos
              </Link>
              <Link
                to="/"
                className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre
              </Link>
              
              {isAuthenticated ? (
                <>
                  {user?.role === 'ADMIN' || user?.role === 'EDITOR' ? (
                    <Link
                      to="/create-post"
                      className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      New Post
                    </Link>
                  ) : null}
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    const newsletterSection = document.getElementById('newsletter');
                    if (newsletterSection) {
                      newsletterSection.scrollIntoView({ behavior: 'smooth' });
                    }
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Inscrever-se
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
