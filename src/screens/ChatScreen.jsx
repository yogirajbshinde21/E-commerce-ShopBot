import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';
import { sendMessage } from '../api/api';
import ProductSidebar from '../components/ProductSidebar';

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: "Hi! 👋 I'm ShopBot, your AI shopping assistant. What would you like today? Try asking for **pizzas**, **pastas**, or say **menu** to see everything!" }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [sessionId] = useState(() => localStorage.getItem('sessionId') || 'session_' + Date.now());
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { logout, user } = useAuth();
  const { cart, addToCart, setProducts } = useOrder();
  const navigate = useNavigate();

  // Save session ID
  useEffect(() => {
    localStorage.setItem('sessionId', sessionId);
  }, [sessionId]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || typing) return;

    const userMsg = { id: Date.now(), sender: 'user', text: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    try {
      const data = await sendMessage(trimmed, sessionId, cart);
      
      const botMsg = { id: Date.now() + 1, sender: 'bot', text: data.reply };
      setMessages(prev => [...prev, botMsg]);

      // Update products if returned
      if (data.products && data.products.length > 0) {
        setProducts(data.products);
      }

      // Add to cart if the AI recognized an add command
      if (data.addToCart) {
        addToCart(data.addToCart);
      }

      // Handle actions
      if (data.action === 'confirm_order') {
        setTimeout(() => navigate('/order'), 1000);
      } else if (data.action === 'payment_done') {
        setTimeout(() => navigate('/delivery'), 1000);
      }
    } catch (err) {
      const errMsg = { id: Date.now() + 1, sender: 'bot', text: "Sorry, something went wrong. Please try again! 😅" };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Render markdown-like bold text
  const renderText = (text) => {
    return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
    );
  };

  return (
    <div className="chat-screen">
      {/* Chat Panel */}
      <div className="chat-panel">
        <div className="chat-header">
          <h2>🛒 Chat with ShopBot</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {user?.name || 'User'}
            </span>
            <button className="logout-btn" onClick={logout}>Logout</button>
          </div>
        </div>

        <div className="chat-messages">
          {messages.map(msg => (
            <div key={msg.id} className={`message message-${msg.sender}`}>
              <div className="message-avatar">
                {msg.sender === 'bot' ? '🤖' : '👤'}
              </div>
              <div className="message-bubble">
                {renderText(msg.text)}
              </div>
            </div>
          ))}

          {typing && (
            <div className="typing-indicator">
              <span>🤖</span>
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-bar">
          <div className="chat-input-wrapper">
            <input
              ref={inputRef}
              type="text"
              className="input"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={typing}
              id="chat-input"
            />
            <button
              className="btn btn-primary send-btn"
              onClick={handleSend}
              disabled={typing || !input.trim()}
              id="send-button"
            >
              ➤
            </button>
          </div>
        </div>
      </div>

      {/* Product Sidebar */}
      <ProductSidebar />
    </div>
  );
}
