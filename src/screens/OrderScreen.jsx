import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import { createOrder, mockPayment } from '../api/api';

const DELIVERY_FEE = 40;

export default function OrderScreen() {
  const { cart, cartTotal, setOrder, clearCart } = useOrder();
  const [address, setAddress] = useState('123 Main St, Pune');
  const [paymentMethod, setPaymentMethod] = useState('mock');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const total = cartTotal + DELIVERY_FEE;

  // If cart is empty, go back
  if (cart.length === 0) {
    return (
      <div className="order-screen">
        <div className="order-card glass">
          <h2>📦 Order Summary</h2>
          <div className="sidebar-empty">
            <div className="sidebar-empty-icon">🛒</div>
            <p>Your cart is empty!</p>
            <button className="btn btn-primary" onClick={() => navigate('/chat')}>
              ← Back to Chat
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handlePay = async () => {
    setLoading(true);
    setToast(null);

    try {
      // Create order
      const orderData = await createOrder(cart, address);
      setOrder(orderData);

      if (paymentMethod === 'cod') {
        setToast({ type: 'success', text: '✅ Order placed! Cash on Delivery selected.' });
        setTimeout(() => {
          clearCart();
          navigate('/delivery', { replace: true });
        }, 2000);
        return;
      }

      // Mock payment
      const payResult = await mockPayment(orderData.order_id);

      if (payResult.success) {
        setToast({ type: 'success', text: '✅ Payment Successful!' });
        setTimeout(() => {
          clearCart();
          navigate('/delivery', { replace: true });
        }, 2000);
      }
    } catch (err) {
      setToast({ type: 'error', text: `❌ ${err.message || 'Payment failed. Please try again.'}` });
      setLoading(false);
    }
  };

  return (
    <div className="order-screen">
      {/* Toast */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.text}
        </div>
      )}

      <div className="order-card glass">
        <h2>📦 Order Summary</h2>

        {/* Order Items */}
        <div className="order-items">
          {cart.map(item => (
            <div key={item.id} className="order-item">
              <div className="order-item-left">
                <span className="order-item-emoji">{item.emoji || '🍽️'}</span>
                <div className="order-item-details">
                  <h4>{item.name}</h4>
                  <span>x{item.quantity}</span>
                </div>
              </div>
              <span className="order-item-price">₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="order-summary-row">
          <span>Subtotal</span>
          <span>₹{cartTotal}</span>
        </div>
        <div className="order-summary-row">
          <span>Delivery fee</span>
          <span>₹{DELIVERY_FEE}</span>
        </div>
        <div className="order-summary-total">
          <span>Total</span>
          <span>₹{total}</span>
        </div>

        {/* Address */}
        <div className="order-address">
          <h3>📍 Deliver to</h3>
          <input
            type="text"
            className="input"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter delivery address"
            id="address-input"
          />
        </div>

        {/* Payment Method */}
        <div className="order-payment">
          <h3>💳 Payment Method</h3>
          <div className="payment-options">
            <button
              className={`payment-option ${paymentMethod === 'mock' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('mock')}
              id="payment-mock"
            >
              <div className="radio-dot">
                <div className="radio-dot-inner"></div>
              </div>
              Mock Pay
            </button>
            <button
              className={`payment-option ${paymentMethod === 'cod' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('cod')}
              id="payment-cod"
            >
              <div className="radio-dot">
                <div className="radio-dot-inner"></div>
              </div>
              Cash on Delivery
            </button>
          </div>
        </div>

        {/* Pay Button */}
        <button
          className="btn btn-primary btn-lg"
          onClick={handlePay}
          disabled={loading}
          id="pay-button"
        >
          {loading ? (
            <><span className="spinner"></span> Processing...</>
          ) : (
            `Pay ₹${total}`
          )}
        </button>

        {/* Back link */}
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigate('/chat')}
            disabled={loading}
          >
            ← Back to Chat
          </button>
        </div>
      </div>
    </div>
  );
}
