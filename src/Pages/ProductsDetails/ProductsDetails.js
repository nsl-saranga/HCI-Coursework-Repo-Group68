import React, { useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaStar, FaChevronLeft, FaCheck} from 'react-icons/fa';
import { FaCubes } from "react-icons/fa6";
import products from '../../js/products';
import { CartContext } from '../../context/CartContext';
import '../ProductsDetails/ProductsDetails.css';
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';

const ProductDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const product = products.find(p => p.id === parseInt(id));
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(product.image);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const { addToCart } = useContext(CartContext);

  if (!product) return <div className="product-not-found">Product not found</div>;

  const allImages = [product.image, ...(product.additionalImages || [])];

  const handleAddToCart = () => {
    addToCart({
      ...product,
      selectedColor,
      quantity
    });
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2000); // Reset after 2 seconds
  };


  const handleView3D = () => {
    navigate('/3d-tool')
  };


  return (
    <>
      <NavBar />
      <div className="product-details-container">
        <Link to="/products" className="back-button">
          <FaChevronLeft /> Back to Products
        </Link>

        <div className="product-details-grid">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image">
              <img src={mainImage} alt={product.name} />
            </div>
            <div className="thumbnail-images">
              {allImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${product.name} view ${index + 1}`}
                  className={mainImage === img ? 'thumbnail-active' : ''}
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info">
            <h1>{product.name}</h1>
            <div className="rating">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < product.rating ? 'filled' : ''} />
              ))}
              <span>({product.reviews} reviews)</span>
            </div>

            <div className="price">
              <span className="current-price">${product.currentPrice.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="original-price">${product.originalPrice.toFixed(2)}</span>
              )}
              {product.discount > 0 && (
                <span className="discount-badge">-{product.discount}%</span>
              )}
            </div>

            <p className="description">{product.description}</p>

            {/* Color Selection */}
            {/* {product.colors && product.colors.length > 0 && (
              <div className="color-selection">
                <h3>Color:</h3>
                <div className="color-options">
                  {product.colors.map(color => (
                    <div
                      key={color}
                      className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
              </div>
            )} */}

            {/* Quantity Selector */}
            <div className="quantity-selector">
              <h3>Quantity:</h3>
              <div className="quantity-controls">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="buttons-container-product-details">
              <button
                className="view-3-btn"
                onClick={handleView3D}
              >
                < FaCubes/> View in 3D/ 2D Room
              </button>

              <button
                className={`add-to-cart-btn ${isAddedToCart ? 'added' : ''}`}
                onClick={handleAddToCart}
                disabled={isAddedToCart}
              >
                {isAddedToCart ? (
                  <>
                    <FaCheck /> Added to Cart!
                  </>
                ) : (
                  <>
                    <FaShoppingCart /> Add to Cart
                  </>
                )}
              </button>
            </div>
            {/* Product Details */}
            <div className="product-specs">
              <h3>Details</h3>
              <ul>
                <li><strong>Material:</strong> {product.materials?.join(', ')}</li>
                <li><strong>Dimensions:</strong> {product.dimensions}</li>
                <li><strong>Weight:</strong> {product.weight}</li>
                <li><strong>SKU:</strong> {product.sku}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Product Features */}
        <div className="product-features">
          <h2>Features</h2>
          <ul>
            {product.features?.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetailsPage;