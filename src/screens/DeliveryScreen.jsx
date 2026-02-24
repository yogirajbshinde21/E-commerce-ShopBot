import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';

const STAGES = [
  { label: 'Order Placed', icon: '📦' },
  { label: 'Payment Confirmed', icon: '✅' },
  { label: 'Preparing', icon: '👨‍🍳' },
  { label: 'Out for Delivery', icon: '🛵' },
  { label: 'Delivered', icon: '🎉' }
];

const AI_MESSAGES = [
  { title: 'Order received!', text: 'Your order has been placed successfully. We\'re getting things ready!' },
  { title: 'Payment confirmed!', text: 'Your payment has been verified. The kitchen is about to start!' },
  { title: 'Your food is being prepared!', text: 'Our chef is working on your order. Estimated delivery: ~15 mins.' },
  { title: 'Your rider is on the way!', text: 'Your order has been picked up and is heading to you. Almost there!' },
  { title: 'Delivered! 🎉', text: 'Your order has been delivered. Enjoy your meal! Thank you for ordering with ShopBot.' }
];

export default function DeliveryScreen() {
  const [currentStage, setCurrentStage] = useState(0);
  const { order } = useOrder();
  const navigate = useNavigate();

  // Timestamps for each stage
  const [timestamps, setTimestamps] = useState([new Date()]);

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (currentStage >= STAGES.length - 1) return;
    const timer = setTimeout(() => {
      setCurrentStage(s => s + 1);
      setTimestamps(prev => [...prev, new Date()]);
    }, 5000);
    return () => clearTimeout(timer);
  }, [currentStage]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const getEstimatedTime = (stagesAhead) => {
    const est = new Date(Date.now() + stagesAhead * 5 * 60000);
    return '~' + formatTime(est);
  };

  const orderId = order?.order_id || Math.floor(1000 + Math.random() * 9000);

  return (
    <div className="delivery-screen">
      <div className="delivery-card glass">
        {/* Header */}
        <div className="delivery-header">
          <h2>📋 Order #{orderId}</h2>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigate('/chat')}
            id="chat-btn"
          >
            💬 Chat
          </button>
        </div>

        {/* Timeline */}
        <div className="timeline">
          {STAGES.map((stage, index) => {
            let status = 'future';
            if (index < currentStage) status = 'completed';
            else if (index === currentStage) status = 'current';

            return (
              <div key={index} className={`timeline-item ${status}`}>
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <span className="timeline-label">
                    {stage.icon} {stage.label}
                  </span>
                  <span className="timeline-time">
                    {index < currentStage
                      ? formatTime(timestamps[index] || new Date())
                      : index === currentStage
                        ? formatTime(timestamps[index] || new Date())
                        : getEstimatedTime(index - currentStage)
                    }
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* AI Notification */}
        <div className="ai-notification" key={currentStage}>
          <div className="ai-notification-icon">🤖</div>
          <div className="ai-notification-text">
            <strong>{AI_MESSAGES[currentStage].title}</strong>
            {AI_MESSAGES[currentStage].text}
          </div>
        </div>

        {/* Delivered state */}
        {currentStage >= STAGES.length - 1 && (
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/chat')}
            >
              Order Again 🛒
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
