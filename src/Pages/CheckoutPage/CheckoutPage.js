import React, { useState } from 'react';
import { FaLock, FaCreditCard, FaUser, FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import '../CheckoutPage/CheckoutPage.css';
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';
import chair1Img from '../../assets/product-1.png'

const CheckoutPage = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    zipCode: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    saveInfo: false
  });

  const [activeTab, setActiveTab] = useState('shipping');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Checkout submitted:', formData);
    alert('Order placed successfully!');
    navigate('/order-confirmation');
  };

  return (
    <>
      <NavBar/>
      <div className="checkout-page">
        <div className="checkout-header">
          <Link to="/" className="logo">YourStore</Link>
          <div className="secure-checkout">
            <FaLock className="lock-icon" />
            <span>Secure Checkout</span>
          </div>
        </div>

        <div className="checkout-progress">
          <div className={`progress-step ${activeTab === 'shipping' ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-title">Shipping</div>
          </div>
          <div className={`progress-step ${activeTab === 'payment' ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-title">Payment</div>
          </div>
          <div className={`progress-step ${activeTab === 'review' ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-title">Review</div>
          </div>
        </div>

        <div className="checkout-container">
          <div className="checkout-form">
            {activeTab === 'shipping' && (
              <div className="shipping-form">
                <h2 className="section-heading"><FaUser className="icon-green" /> Shipping Information</h2>
                <form>
                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name</label>
                      <input 
                        type="text" 
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input 
                        type="text" 
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required 
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label><FaEnvelope className="icon-green" /> Email</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label><FaPhone className="icon-green" /> Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label><FaMapMarkerAlt className="icon-green" /> Address</label>
                    <input 
                      type="text" 
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required 
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>City</label>
                      <input 
                        type="text" 
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label>Country</label>
                      <select 
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Country</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="UK">United Kingdom</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>ZIP Code</label>
                      <input 
                        type="text" 
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        required 
                      />
                    </div>
                  </div>

                  <div className="form-actions form-actions-first">
                    <button 
                      type="button" 
                      className="btn-next"
                      onClick={() => setActiveTab('payment')}
                    >
                      Continue to Payment
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="payment-form">
                <h2 className="section-heading"><FaCreditCard className="icon-green" /> Payment Method</h2>
                <form>
                  <div className="form-group">
                    <label>Card Number</label>
                    <input 
                      type="text" 
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="1234 5678 9012 3456"
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>Name on Card</label>
                    <input 
                      type="text" 
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleChange}
                      required 
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input 
                        type="text" 
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        placeholder="MM/YY"
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input 
                        type="text" 
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        placeholder="123"
                        required 
                      />
                    </div>
                  </div>

                  <div className="form-checkbox">
                    <input 
                      type="checkbox" 
                      id="saveInfo"
                      name="saveInfo"
                      checked={formData.saveInfo}
                      onChange={handleChange}
                    />
                    <label htmlFor="saveInfo">Save payment information for next time</label>
                  </div>

                  <div className="form-actions">
                    <button 
                      type="button" 
                      className="btn-back"
                      onClick={() => setActiveTab('shipping')}
                    >
                      Back to Shipping
                    </button>
                    <button 
                      type="button" 
                      className="btn-next"
                      onClick={() => setActiveTab('review')}
                    >
                      Review Order
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'review' && (
              <div className="review-order">
                <h2 className="section-heading">Review Your Order</h2>
                
                <div className="order-summary">
                  <h3 className="summary-heading">Shipping Information</h3>
                  <p>{formData.firstName} {formData.lastName}</p>
                  <p>{formData.address}</p>
                  <p>{formData.city}, {formData.country} {formData.zipCode}</p>
                  <p>{formData.email}</p>
                  <p>{formData.phone}</p>
                </div>

                <div className="order-summary">
                  <h3 className="summary-heading">Payment Method</h3>
                  <p>Card ending in ****{formData.cardNumber.slice(-4)}</p>
                  <p>Expires {formData.expiryDate}</p>
                </div>

                <div className="order-items">
                  <h3 className="summary-heading">Order Items</h3>
                  <div className="order-item">
                    <div className="item-image">
                        <img src={chair1Img} alt="Product" />
                    </div>
                    <div className="item-details">
                        <div className="item-info">
                        <h4>Product Name</h4>
                        <p>Quantity: 1</p>
                        </div>
                        <div className="item-price">$99.99</div>
                    </div>
                    </div>
                 </div>

                <div className="order-totals">
                  <div className="total-row">
                    <span>Subtotal:</span>
                    <span>$99.99</span>
                  </div>
                  <div className="total-row">
                    <span>Shipping:</span>
                    <span>$5.99</span>
                  </div>
                  <div className="total-row">
                    <span>Tax:</span>
                    <span>$8.50</span>
                  </div>
                  <div className="total-row grand-total">
                    <span>Total:</span>
                    <span>$114.48</span>
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn-back"
                    onClick={() => setActiveTab('payment')}
                  >
                    Back to Payment
                  </button>
                  <button 
                    type="submit" 
                    className="btn-submit"
                    onClick={handleSubmit}
                  >
                    Place Order
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="order-summary-sidebar">
            <h3 className="sidebar-heading">Order Summary</h3>
            <div className="order-items">
                <div className="order-item">
                    <div className="item-image">
                        <img src={chair1Img} alt="Product" />
                    </div>
                    <div className="item-details">
                            <h4>Product Name</h4>
                            <p>Quantity: 1</p>
                            <div className="item-price">$99.99</div>     
                        </div>
                </div>
            </div>

            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>$99.99</span>
              </div>
              <div className="total-row">
                <span>Shipping:</span>
                <span>$5.99</span>
              </div>
              <div className="total-row">
                <span>Tax:</span>
                <span>$8.50</span>
              </div>
              <div className="total-row grand-total">
                <span>Total:</span>
                <span>$114.48</span>
              </div>
            </div>

            <div className="secure-checkout">
              <FaLock className="lock-icon" />
              <span>Secure Checkout</span>
              <p>Your information is protected by 256-bit SSL encryption</p>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default CheckoutPage;