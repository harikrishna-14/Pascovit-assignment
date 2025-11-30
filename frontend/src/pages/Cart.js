import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import './Cart.css';

const Cart = () => {
  const { cart, updateCart, removeFromCart, getTotalPrice } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <h1>Shopping Cart</h1>
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <Link to="/products" className="btn-continue-shopping">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (productId, size, newQuantity) => {
    if (newQuantity > 0) {
      updateCart(productId, size, newQuantity);
    }
  };

  const handleRemove = (productId, size) => {
    removeFromCart(productId, size);
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  const totalPrice = getTotalPrice();

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Shopping Cart</h1>

        <div className="cart-layout">
          <div className="cart-items-section">
            {cart.items.map((item, index) => (
              <div key={index} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-image" />
                
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p className="cart-item-size">Size: {item.size}</p>
                </div>

                <div className="cart-item-quantity">
                  <button 
                    onClick={() => handleQuantityChange(item.product, item.size, item.quantity - 1)}
                    className="qty-btn-small"
                  >
                    −
                  </button>
                  <input type="number" value={item.quantity} readOnly />
                  <button 
                    onClick={() => handleQuantityChange(item.product, item.size, item.quantity + 1)}
                    className="qty-btn-small"
                  >
                    +
                  </button>
                </div>

                <div className="cart-item-price">
                  <p className="price">₹{item.price * item.quantity}</p>
                  <p className="unit-price">₹{item.price} each</p>
                </div>

                <button 
                  onClick={() => handleRemove(item.product, item.size)}
                  className="btn-remove"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            
            <div className="summary-item">
              <span>Subtotal:</span>
              <span>₹{totalPrice}</span>
            </div>
            
            <div className="summary-item">
              <span>Shipping:</span>
              <span>{totalPrice > 1000 ? 'FREE' : '₹99'}</span>
            </div>
            
            <div className="summary-item">
              <span>Tax (18%):</span>
              <span>₹{Math.round(totalPrice * 0.18)}</span>
            </div>

            <div className="summary-total">
              <span>Total:</span>
              <span>₹{Math.round(totalPrice * 1.18 + (totalPrice > 1000 ? 0 : 99))}</span>
            </div>

            <button onClick={handleCheckout} className="btn-checkout">
              Proceed to Checkout
            </button>

            <Link to="/products" className="btn-continue">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;