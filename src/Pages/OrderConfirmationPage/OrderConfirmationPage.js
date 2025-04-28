import React from 'react';
import { FaCheckCircle, FaBox, FaHome, FaShoppingBag } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../OrderConfirmationPage/OrderConfirmationPage.css';
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';
import chair1Img from '../../assets/chair1.png';

const OrderConfirmation = () => {
  // Sample order data - in a real app this would come from your backend/state
  const orderDetails = {
    orderNumber: `ORD-${Math.floor(Math.random() * 1000000)}`,
    date: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    items: [
      { id: 1, name: 'Modern Wooden Chair', price: 149.99, quantity: 1, image: chair1Img },
      { id: 2, name: 'Minimalist Coffee Table', price: 229.99, quantity: 1, image: chair1Img }
    ],
    shippingAddress: {
      name: 'John Doe',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'United States'
    },
    paymentMethod: 'VISA ending in 4242',
    subtotal: 379.98,
    shipping: 0,
    tax: 34.20,
    total: 414.18,
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    })
  };

  return (
    <>
      <NavBar />
      <div className="confirmation-container">
        <div className="confirmation-card">
          <div className="confirmation-header">
            <FaCheckCircle className="confirmation-icon" />
            <h1>Order Confirmed!</h1>
            <p className="order-number">Order #{orderDetails.orderNumber}</p>
            <p className="confirmation-message">
              Thank you for your purchase. A confirmation email has been sent to your email address.
            </p>
          </div>

          <div className="order-details">
            <div className="details-section">
              <h2><FaBox className="icon-green" /> Order Summary</h2>
              <div className="order-items">
                {orderDetails.items.map(item => (
                  <div key={item.id} className="order-item">
                    <div className="item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="item-info">
                      <h3>{item.name}</h3>
                      <p>Qty: {item.quantity}</p>
                    </div>
                    <div className="item-price">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="details-grid">
              <div className="details-section">
                <h2>Shipping Information</h2>
                <address>
                  <p>{orderDetails.shippingAddress.name}</p>
                  <p>{orderDetails.shippingAddress.street}</p>
                  <p>{orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.zip}</p>
                  <p>{orderDetails.shippingAddress.country}</p>
                </address>
                <p className="delivery-estimate">
                  <strong>Estimated Delivery:</strong> {orderDetails.estimatedDelivery}
                </p>
              </div>

              <div className="details-section">
                <h2>Payment Method</h2>
                <p>{orderDetails.paymentMethod}</p>
                
                <h2>Order Total</h2>
                <div className="order-totals">
                  <div className="total-row">
                    <span>Subtotal:</span>
                    <span>${orderDetails.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="total-row">
                    <span>Shipping:</span>
                    <span>${orderDetails.shipping.toFixed(2)}</span>
                  </div>
                  <div className="total-row">
                    <span>Tax:</span>
                    <span>${orderDetails.tax.toFixed(2)}</span>
                  </div>
                  <div className="total-row grand-total">
                    <span>Total:</span>
                    <span>${orderDetails.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="confirmation-actions">
            <Link to="/orders" className="btn btn-orders">
              <FaShoppingBag /> View Order History
            </Link>
            <Link to="/" className="btn btn-continue">
              <FaHome /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderConfirmation;