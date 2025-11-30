import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import { CartContext } from '../context/CartContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getProduct(id);
      setProduct(response.data.product);
    } catch (error) {
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      setError('Please select a size');
      return;
    }

    try {
      await addToCart(product._id, selectedSize, quantity);
      setSuccess('Added to cart successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to add to cart');
    }
  };

  if (loading) return <div className="container" style={{ padding: '2rem' }}>Loading...</div>;
  if (!product) return <div className="container" style={{ padding: '2rem' }}>Product not found</div>;

  return (
    <div className="product-detail-page">
      <div className="container">
        <button onClick={() => navigate('/products')} className="btn-back">
          ← Back to Products
        </button>

        <div className="product-detail-layout">
          <div className="product-image-section">
            <img src={product.image} alt={product.name} />
          </div>

          <div className="product-details-section">
            <h1>{product.name}</h1>
            <p className="product-category-detail">{product.category}</p>
            
            <div className="product-meta">
              <span className="product-price-detail">₹{product.price}</span>
              <span className={`product-stock-detail ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
              </span>
            </div>

            <p className="product-description">{product.description}</p>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div className="product-options">
              <div className="option-group">
                <label>Select Size *</label>
                <div className="size-options">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="option-group">
                <label>Quantity</label>
                <div className="quantity-selector">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="qty-btn"
                  >
                    −
                  </button>
                  <input type="number" value={quantity} readOnly />
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="qty-btn"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <button 
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="btn-add-to-cart"
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>

            <div className="product-shipping">
              <h3>Shipping Information</h3>
              <ul>
                <li>✓ Free shipping on orders over ₹1000</li>
                <li>✓ 7 days easy returns</li>
                <li>✓ 100% authentic products</li>
                <li>✓ Cash on delivery available</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;