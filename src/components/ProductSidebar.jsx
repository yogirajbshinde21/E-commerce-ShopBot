import { useNavigate } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';

export default function ProductSidebar() {
  const { products, cart, addToCart, removeFromCart, cartTotal, cartCount } = useOrder();
  const navigate = useNavigate();

  const handleConfirmOrder = () => {
    if (cartCount > 0) {
      navigate('/order');
    }
  };

  return (
    <div className="product-sidebar">
      <div className="sidebar-header">
        <h3>🛍️ Products</h3>
      </div>

      {products.length === 0 ? (
        <div className="sidebar-empty">
          <div className="sidebar-empty-icon">🛒</div>
          <p>Products will appear here when you ask ShopBot for recommendations</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Try: "Show me some pizzas"
          </p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map(product => {
            const inCart = cart.find(item => item.id === product.id);
            return (
              <div key={product.id} className="product-card">
                <div className="product-img">
                  {product.emoji || '🍽️'}
                </div>
                <div className="product-info">
                  <div className="product-name" title={product.name}>{product.name}</div>
                  <div className="product-price">₹{product.price}</div>
                  <button
                    className={`btn btn-sm ${inCart ? 'btn-success' : 'btn-primary'}`}
                    onClick={() => addToCart(product)}
                    id={`add-product-${product.id}`}
                  >
                    {inCart ? `Added (${inCart.quantity})` : 'Add'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cart Section */}
      {cartCount > 0 && (
        <div className="cart-section">
          <div className="cart-header">
            <h4>🛒 Cart</h4>
            <span className="cart-badge">{cartCount} item{cartCount !== 1 ? 's' : ''}</span>
          </div>

          <div className="cart-items">
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <span className="cart-item-name">{item.name}</span>
                <span className="cart-item-qty">x{item.quantity}</span>
                <span className="cart-item-price">₹{item.price * item.quantity}</span>
                <button
                  className="cart-item-remove"
                  onClick={() => removeFromCart(item.id)}
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="cart-total">
            <span>Total</span>
            <span>₹{cartTotal}</span>
          </div>

          <button
            className="btn btn-success"
            onClick={handleConfirmOrder}
            id="confirm-order-btn"
          >
            Confirm Order →
          </button>
        </div>
      )}
    </div>
  );
}
