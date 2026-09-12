import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google'

const NavBar = ({ name, setName, setToken,setIsAuthenticated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };
  const apiUrl = import.meta.env.VITE_API_URL;
  const handleLogout = async () => {
    try {
      await axios.post(`${apiUrl}/logout`, {}, { withCredentials: true });
    sessionStorage.clear();
    setIsAuthenticated(false);
    googleLogout(); 
    navigate('/signin');
    setName('');
    setToken('');
    }
    catch (error) {
      console.error('Logout failed:', error.response ? error.response.data : error.message);
    }
  };

  const getLinkClass = (path) => {
    return location.pathname === path
      ? 'text-white font-semibold px-3 py-1.5 rounded-full bg-white/10'
      : 'text-slate-300 font-semibold px-3 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-colors duration-200';
  };

  return (
    <nav className="bg-brand-dark shadow-lg shadow-brand-950/40 px-6 py-4 sticky top-0 z-40">
      <div className="container mx-auto flex items-center justify-between gap-2">

        <div className="flex items-center space-x-2 shrink-0">
          <Link to="/" className="flex items-center text-white">
            <img
              src="https://res.cloudinary.com/dta4cujnn/image/upload/v1626255557/logo_qaexch.png"
              width="30"
              height="30"
              alt="MCA Box Logo"
              className="mr-2 rounded"
            />
            <span className="text-lg font-semibold hidden sm:inline bg-gradient-to-r from-brand-300 to-cyan-300 text-transparent bg-clip-text">ACAD MCA</span>
          </Link>
        </div>


        {name && (
          <div className="text-sm sm:text-lg font-semibold bg-gradient-to-r from-teal-300 to-brand-300 text-transparent bg-clip-text truncate min-w-0 flex-1 text-center">
            Welcome, <span className="ml-1">{name}</span>
          </div>
        )}


        <div className="hidden md:flex space-x-2">
          <Link to="/" className={getLinkClass('/')}>
            Home
          </Link>
          <Link to="/classroom" className={getLinkClass('/classroom')}>
            Courses
          </Link>
          <Link to="/coding" className={getLinkClass('/coding')}>
            CSheet
          </Link>
          <Link to="/playground" className={getLinkClass('/playground')}>
            Playground
          </Link>
          <Link to="/about-us" className={getLinkClass('/about-us')}>
            About us
          </Link>
        </div>

        <div className="hidden md:block">
          <button
            onClick={handleLogout}
            className="bg-red-500/90 text-white font-semibold py-2 px-4 rounded-full hover:bg-red-500 hover:shadow-md hover:shadow-red-500/30 transition-all duration-200"
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            className="text-white focus:outline-none"
            onClick={toggleMenu}
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className={getLinkClass('/')}
                onClick={closeMenu}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/classroom"
                className={getLinkClass('/classroom')}
                onClick={closeMenu}
              >
                Courses
              </Link>
            </li>
            <li>
              <Link
                to="/coding"
                className={getLinkClass('/coding')}
                onClick={closeMenu}
              >
                CSheet
              </Link>
            </li>
            <li>
              <Link
                to="/playground"
                className={getLinkClass('/playground')}
                onClick={closeMenu}
              >
                Playground
              </Link>
            </li>
            <li>
              <Link
                to="/about-us"
                className={getLinkClass('/about-us')}
                onClick={closeMenu}
              >
                About us
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  handleLogout();
                }}
                className="w-full text-left block text-white font-semibold px-3 py-2 hover:bg-red-500 bg-red-500/90 rounded-md transition-colors duration-200"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
