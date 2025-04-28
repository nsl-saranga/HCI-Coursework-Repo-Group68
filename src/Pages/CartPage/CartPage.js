import React from 'react';
import { FaTrash, FaPlus, FaMinus, FaArrowLeft } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import '../CartPage/CartPage.css';
import products from '../../js/products';
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';
import useUser from '../../hooks/useUser';

const CartPage = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useUser();

  // For UI testing - sample cart items from products
  const displayCart = [
    {
      ...products[0],
      selectedColor: products[0].colors?.[0] || '#3a5a40',
      quantity: 2,
    },
    {
      ...products[1],
      selectedColor: products[1].colors?.[0] || '#588157',
      quantity: 1,
    },
  ];

  // Calculate order summary
  const subtotal = displayCart.reduce((sum, item) => sum + item.currentPrice * item.quantity, 0);
  const tax = subtotal * 0.1;
  const shipping = subtotal > 100 ? 0 : 15;
  const total = subtotal + tax + shipping;

  // Mock functions for UI testing
  const updateQuantity = (id, color, newQuantity) => {
    console.log(`Would update quantity for item ${id} (color ${color}) to ${newQuantity}`);
  };

  const removeFromCart = (id, color) => {
    console.log(`Would remove item ${id} (color ${color}) from cart`);
  };

  return (
    <>
      <NavBar />

      <div className="cart-page-container">
        <div className="cart-header">
          <Link to="/products" className="back-to-shop">
            <FaArrowLeft /> Continue Shopping
          </Link>
          <h1>Your Shopping Cart</h1>
        </div>

        {isLoading ? (
          <div className="loading-message">Loading...</div>
        ) : user ? (
          <div className="cart-content-wrapper">
            <div className="cart-items-section">
              {displayCart.map((item) => (
                <div key={`${item.id}-${item.selectedColor}`} className="cart-item-card">
                  <div className="item-image-container">
                    <img src={item.image} alt={item.name} className="item-image" />
                  </div>

                  <div className="item-details">
                    <div className="item-header">
                      <h3 className="item-name">{item.name}</h3>
                      <button
                        className="remove-item-btn"
                        onClick={() => removeFromCart(item.id, item.selectedColor)}
                        aria-label="Remove item"
                      >
                        <FaTrash />
                      </button>
                    </div>

                    {item.selectedColor && (
                      <div className="color-selection">
                        <span className="color-label">Color: </span>
                        <div
                          className="color-swatch"
                          style={{ backgroundColor: item.selectedColor }}
                          title={item.selectedColor}
                        />
                        <span className="color-name">{item.selectedColor}</span>
                      </div>
                    )}

                    <div className="price-quantity-row">
                      <span className="item-price">${item.currentPrice.toFixed(2)}</span>

                      <div className="quantity-control">
                        <button
                          className="quantity-btn minus"
                          onClick={() => updateQuantity(item.id, item.selectedColor, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <FaMinus />
                        </button>
                        <span className="quantity-value">{item.quantity}</span>
                        <button
                          className="quantity-btn plus"
                          onClick={() => updateQuantity(item.id, item.selectedColor, item.quantity + 1)}
                        >
                          <FaPlus />
                        </button>
                      </div>

                      <div className="item-total">
                        ${(item.currentPrice * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-summary">
              <div className="summary-card">
                <h2>Order Summary</h2>

                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                <div className="summary-row">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>

                <div className="summary-row">
                  <span>Estimated Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-row total-row">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <button className="checkout-btn" onClick={() => navigate('/checkout')}>
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="cart-login-prompt">
            <p>Please log in to view your cart.</p>
            <button className="cart-login-btn" onClick={() => navigate('/login')}>
              Log in to view Cart
            </button>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default CartPage;
