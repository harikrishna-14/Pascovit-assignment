import { useState } from 'react';
import './Payment.css';

const paymentOptionsList = [
  { id: 'CARD', displayText: 'Card', isDisabled: true },
  { id: 'NET BANKING', displayText: 'Net Banking', isDisabled: true },
  { id: 'UPI', displayText: 'UPI', isDisabled: true },
  { id: 'WALLET', displayText: 'Wallet', isDisabled: true },
  { id: 'CASH ON DELIVERY', displayText: 'Cash on Delivery', isDisabled: false },
];

const Payment = ({ cart, totalPrice, onPlaceOrder }) => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  const updatePaymentMethod = (event) => {
    setPaymentMethod(event.target.id);
  };

  const handleConfirmOrder = async () => {
    if (!paymentMethod) return;
    if (onPlaceOrder) {
      await onPlaceOrder(paymentMethod); // Backend creates order + sends email
      setIsOrderPlaced(true);
    }
  };

  return (
    <div className="payments-container">
      {isOrderPlaced ? (
        <p className="success-message">Your order has been placed successfully! 🎉</p>
      ) : (
        <>
          <h1 className="payments-heading">Payment Details</h1>
          <p className="payments-sub-heading">Payment Method</p>
          <ul className="payment-method-inputs">
            {paymentOptionsList.map((method) => (
              <li key={method.id} className="payment-method-input-container">
                <input
                  id={method.id}
                  type="radio"
                  name="paymentMethod"
                  disabled={method.isDisabled}
                  onChange={updatePaymentMethod}
                />
                <label
                  className={`payment-method-label ${method.isDisabled ? 'disabled-label' : ''}`}
                  htmlFor={method.id}
                >
                  {method.displayText}
                </label>
              </li>
            ))}
          </ul>

          <div className="order-details">
            <p className="payments-sub-heading">Order Details</p>
            <p>Items: {cart.items.length}</p>
            <p>Total: ₹{totalPrice}</p>
          </div>

          <button
            disabled={!paymentMethod}
            type="button"
            className="confirm-order-button"
            onClick={handleConfirmOrder}
          >
            Confirm Order
          </button>
        </>
      )}
    </div>
  );
};

export default Payment;
