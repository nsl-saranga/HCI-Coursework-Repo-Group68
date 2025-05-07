import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaGoogle, FaFacebook, FaApple } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import '../Signup/Signup.css';
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [userRole, setUserRole] = useState('customer'); // Add role stat
  

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Invalid email address';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.acceptTerms) newErrors.acceptTerms = 'You must accept the terms';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    const auth = getAuth();

    try {
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      setIsLoading(false);
      setSuccess(true);
    } catch (error) {
      setIsLoading(false);
      const newErrors = {};
      if (error.code === 'auth/email-already-in-use') {
        newErrors.email = 'Email is already in use';
      } else if (error.code === 'auth/invalid-email') {
        newErrors.email = 'Invalid email address';
      } else if (error.code === 'auth/weak-password') {
        newErrors.password = 'Password is too weak';
      } else {
        newErrors.email = 'An error occurred. Please try again';
      }
      setErrors(newErrors);
    }
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

  if (success) {
    return (
      <>
        <NavBar />
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h2>Welcome Aboard!</h2>
              <p>Your account has been created successfully</p>
              <div className="success-message">
                <p>We've sent a confirmation email to <strong>{formData.email}</strong></p>
                <Link to="/login" className="auth-button">
                  Continue to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Create Your Account</h2>
            <p>Join us to start shopping</p>
          </div>
                  {/* Add Role Selector here */}
                  <div className="role-selection-wrapper">
            <p>Select your role:</p>
            <RoleSelector />
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="name-fields">
              <div className="input-group">
                <label htmlFor="firstName">First Name</label>
                <div className="input-field">
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={errors.firstName ? 'error' : ''}
                  />
                </div>
                {errors.firstName && <span className="error-text">{errors.firstName}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="lastName">Last Name</label>
                <div className="input-field">
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-field">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                />
              </div>
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="input-field">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'error' : ''}
                />
              </div>
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-field">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? 'error' : ''}
                />
              </div>
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>

            <div className="input-group terms-group">
              <label className="terms-label">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className={errors.acceptTerms ? 'error' : ''}
                />
                I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
              </label>
              {errors.acceptTerms && <span className="error-text">{errors.acceptTerms}</span>}
            </div>

            <button type="submit" className="auth-button" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className="social-auth">
            <p className="divider"><span>or sign up with</span></p>
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

          <div className="auth-footer">
            Already have an account? <Link to="/login">Log in</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SignupPage;
