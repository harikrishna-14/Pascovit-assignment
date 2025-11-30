import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import Payment from './Payment';
import './Checkout.css';

const Checkout = () => {
  const { cart, getTotalPrice, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [openPaymentPopup, setOpenPaymentPopup] = useState(false);

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Validate shipping form
  const validateForm = () => {
    const { fullName, phone, address, city, state, pincode } = formData;
    if (!fullName || !phone || !address || !city || !state || !pincode) {
      setError('Please fill all required fields');
      return false;
    }
    if (!/^\d{10}$/.test(phone)) {
      setError('Phone number must be 10 digits');
      return false;
    }
    if (!/^\d{6}$/.test(pincode)) {
      setError('Pincode must be 6 digits');
      return false;
    }
    setError('');
    return true;
  };

  // Open payment popup after validation
  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setOpenPaymentPopup(true);
    }
  };

  // Place order (backend creates order and sends email)
  const handlePlaceOrder = async (paymentMethod) => {
    setLoading(true);
    try {
      if (!cart.items || cart.items.length === 0) {
        throw new Error('Cart is empty');
      }

      const totalPrice = getTotalPrice();
      const tax = Math.round(totalPrice * 0.18);
      const shipping = totalPrice > 1000 ? 0 : 99;
      const finalTotal = totalPrice + tax + shipping;

      const orderData = {
        items: cart.items,
        totalPrice: finalTotal,
        shippingAddress: formData,
        paymentMethod,
        sessionId: localStorage.getItem('sessionId'),
      };

      const response = await orderAPI.createOrder(orderData); // backend sends email
      await clearCart();
      navigate(`/order/${response.data.order._id}`);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Order creation failed');
    } finally {
      setLoading(false);
    }
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="empty-cart">
            <p>Your cart is empty. Please add items before checkout.</p>
            <button onClick={() => navigate('/products')} className="btn-back-shopping">
              Back to Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalPrice = getTotalPrice();
  const tax = Math.round(totalPrice * 0.18);
  const shipping = totalPrice > 1000 ? 0 : 99;
  const finalTotal = totalPrice + tax + shipping;

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Checkout</h1>

        <div className="checkout-layout">
          <form className="checkout-form" onSubmit={handleProceedToPayment}>
            <fieldset>
              <legend>Shipping Address</legend>
              {error && <div className="alert alert-error">{error}</div>}

              <div className="form-group">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  pattern="[0-9]{10}"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Address *</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="state">State *</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="pincode">Pincode *</label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  pattern="[0-9]{6}"
                  required
                />
              </div>

              <button type="submit" className="checkout-btn">
                Proceed to Payment
              </button>
            </fieldset>
          </form>

          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="order-items">
              {cart.items.map((item, idx) => (
                <div key={idx} className="order-item">
                  <div>
                    <p className="item-name">{item.name}</p>
                    <p className="item-details">
                      Size: {item.size} | Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="item-price">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>

            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>₹{totalPrice}</span>
              </div>
              <div className="total-row">
                <span>Shipping:</span>
                <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
              <div className="total-row">
                <span>Tax (18%):</span>
                <span>₹{tax}</span>
              </div>
              <div className="total-row final">
                <span>Total:</span>
                <span>₹{finalTotal}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Popup */}
        <Popup
          modal
          open={openPaymentPopup}
          onClose={() => setOpenPaymentPopup(false)}
        >
          {close => (
            <Payment
              cart={cart}
              totalPrice={finalTotal}
              onPlaceOrder={async (paymentMethod) => {
                await handlePlaceOrder(paymentMethod); // Backend creates order + sends email
                close();
              }}
            />
          )}
        </Popup>
      </div>
    </div>
  );
};

export default Checkout;
