import React, { useState } from 'react';
import { FaSearch, FaShoppingCart, FaUser, FaBars, FaTimes, FaBoxOpen } from 'react-icons/fa';
import '../NavBar/NavBar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo and Mobile Toggle */}
        <div className="navbar-main-group">
          <div className="navbar-logo">
            <a href="/">FurniCraft</a>
          </div>
          <div className="mobile-menu-toggle" onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </div>
        </div>

        {/* All other elements */}
        <div className="navbar-secondary-group">
          {/* Navigation Links */}
          <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/shop">Shop</a></li>
              <li><a href="/living-room">Living Room</a></li>
              <li><a href="/bedroom">Bedroom</a></li>
              <li><a href="/dining">Dining</a></li>
              <li><a href="/office">Studyroom</a></li>
              <li><a href="/dining">Kitchen</a></li>
              <li><a href="/office">Office</a></li>
              <li><a href="/about">About</a></li>
            </ul>
          </div>

          {/* Search and Actions */}
          <div className="navbar-action-group">
            <div className="navbar-search">
              <form className="search-form" onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search furniture..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-button">
                  <FaSearch />
                </button>
              </form>
            </div>

            <div className="navbar-actions">
              <a href="/cart" className="cart-icon">
                <FaShoppingCart />
                {/* <span className="cart-count">0</span> */}
              </a>
              <a href="/orders" className="order-icon">
                <FaBoxOpen/>
                {/* <span className="cart-count">0</span> */}
              </a>
              <div className="auth-buttons">
                <a href="/login" className="login-btn">
                  <FaUser /> Login
                </a>
                <a href="/register" className="signup-btn">
                  Sign Up
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;