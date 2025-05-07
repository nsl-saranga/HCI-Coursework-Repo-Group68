import React, { useState } from 'react';
import { FaUser, FaLock, FaGoogle, FaFacebook, FaApple } from 'react-icons/fa';
import { Link, useNavigate} from 'react-router-dom';
import '../Login/Login.css';
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('customer'); // Add role stat

  const navigate = useNavigate()

  const login= async()=>{
    try{
      await signInWithEmailAndPassword(getAuth(), email, password)
      navigate("/")
    }
    catch(e){
      setError(e.message)
    }
    
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simulate login API call
    setTimeout(() => {
      if (email && password) {
        console.log('Login successful');
        // Redirect to account page in real implementation
      } else {
        setError('Please fill in all fields');
      }
      setIsLoading(false);
    }, 1500);
  };


    // Add role selection component
    const RoleSelector = () => (
      <div className="role-selection">
        <label className="role-option">
          <input
            type="radio"
            name="role"
            value="customer"
            checked={userRole === 'customer'}
            onChange={(e) => setUserRole(e.target.value)}
          />
          <span className="role-label">Customer</span>
        </label>
        <label className="role-option">
          <input
            type="radio"
            name="role"
            value="admin"
            checked={userRole === 'admin'}
            onChange={(e) => setUserRole(e.target.value)}
          />
          <span className="role-label">Admin</span>
        </label>
      </div>
    );

  return (
    <>
      <NavBar />
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Sign in to access your orders, wishlist, and account settings</p>
          </div>

              {/* Add Role Selector here */}
              <div className="role-selection-wrapper">
            <p>Select your role:</p>
            <RoleSelector />
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-field">
                <FaUser className="input-icon" />
                <input
                  type="email"
                  id="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="input-field">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="password-options">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  Remember me
                </label>
                <Link to="/forgot-password" className="forgot-password">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button type="submit" className="login-button" disabled={isLoading} onClick={login}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="social-login">
            <p className="divider">or continue with</p>
            <div className="social-icons">
              <button type="button" className="social-button google">
                <FaGoogle /> Google
              </button>
              <button type="button" className="social-button facebook">
                <FaFacebook /> Facebook
              </button>
              <button type="button" className="social-button apple">
                <FaApple /> Apple
              </button>
            </div>
          </div>

          <div className="signup-link">
            Don't have an account? <Link to="/register">Sign up</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LoginPage;