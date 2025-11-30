import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await orderAPI.getOrder(id);
      setOrder(response.data.order);
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container" style={{ padding: '2rem' }}>Loading...</div>;
  }

  if (!order) {
    return (
      <div className="container" style={{ padding: '2rem' }}>
        <p>Order not found</p>
        <button onClick={() => navigate('/')} className="btn-home">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="order-success-page">
      <div className="container">
        <div className="success-container">
          <div className="success-header">
            <div className="success-icon">✓</div>
            <h1>Order Confirmed!</h1>
            <p>Thank you for your purchase</p>
          </div>

          <div className="order-card">
            <div className="order-info">
              <div className="info-row">
                <span className="label">Order ID:</span>
                <span className="value">{order._id}</span>
              </div>
              <div className="info-row">
                <span className="label">Order Date:</span>
                <span className="value">
                  {new Date(order.orderDate).toLocaleDateString('en-IN')}
                </span>
              </div>
              <div className="info-row">
                <span className="label">Status:</span>
                <span className={`value status-${order.status}`}>{order.status}</span>
              </div>
            </div>

            <div className="order-items-section">
              <h2>Items Ordered</h2>
              {order.items.map((item, idx) => (
                <div key={idx} className="order-item">
                  <div className="item-info">
                    <p className="item-name">{item.name}</p>
                    <p className="item-details">Size: {item.size} | Qty: {item.quantity}</p>
                  </div>
                  <p className="item-total">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>

            <div className="order-total">
              <span>Total Amount:</span>
              <span className="amount">₹{order.totalPrice}</span>
            </div>

            {order.shippingAddress && (
              <div className="shipping-info">
                <h2>Shipping Address</h2>
                <p>{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.pincode}
                </p>
                <p>Phone: {order.shippingAddress.phone}</p>
              </div>
            )}

            <div className="next-steps">
              <h2>What's Next?</h2>
              <ul>
                <li>✓ An order confirmation email has been sent</li>
                <li>✓ Your order will be processed and shipped soon</li>
                <li>✓ You'll receive a tracking number via email</li>
                <li>✓ Expected delivery: 5-7 business days</li>
              </ul>
            </div>
          </div>

          <div className="action-buttons">
            <button onClick={() => navigate('/products')} className="btn-continue-shopping">
              Continue Shopping
            </button>
            <button onClick={() => navigate('/')} className="btn-home-nav">
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;