import React from 'react';
import { FaStar, FaRegHeart, FaHeart, FaShoppingCart } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Add this import
import '../Card/Card.css';

const Card = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = React.useState(false);
  
  // Prevent the link navigation when clicking on interactive elements
  const handleInteractiveClick = (e) => {
    e.stopPropagation();
  };

  return (
    <Link 
      to={`/products/${product.id}`} 
      className="product-card-link" // We'll style this
    >
      <div className="product-card">
        <div className="product-badge">-{product.discount}%</div>
        <button 
          className="wishlist-btn"
          onClick={(e) => {
            handleInteractiveClick(e);
            setIsWishlisted(!isWishlisted);
          }}
        >
          {isWishlisted ? (
            <FaHeart className="wishlist-icon filled" />
          ) : (
            <FaRegHeart className="wishlist-icon" />
          )}
        </button>
        
        <div className="product-image-container">
          <img 
            src={product.image} 
            alt={product.name} 
            className="product-image"
          />
          <button 
            className="quick-view-btn"
            onClick={handleInteractiveClick}
          >
            Quick View
          </button>
        </div>
        
        <div className="product-info">
          <div className="product-category">{product.category}</div>
          <h3 className="product-name">{product.name}</h3>
          
          <div className="product-rating">
            {[...Array(5)].map((_, i) => (
              <FaStar 
                key={i} 
                className={`star ${i < product.rating ? 'filled' : ''}`} 
              />
            ))}
            <span>({product.reviews})</span>
          </div>
          
          <div className="product-pricing">
            <span className="current-price">${product.currentPrice}</span>
            {product.originalPrice && (
              <span className="original-price">${product.originalPrice}</span>
            )}
          </div>
          
          <button 
            className="add-to-cart-btn"
            onClick={(e) => {
              handleInteractiveClick(e);
              // You might want to handle add to cart here or in details page
            }}
          >
            <FaShoppingCart /> Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
};

export default Card;