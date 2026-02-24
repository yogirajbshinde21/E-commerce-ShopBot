/**
 * Mock API Layer
 * Simulates all backend endpoints for demo/development.
 * Replace with real API calls when the backend URL is available.
 */

// ---------- Mock Data ----------

const MOCK_USER = {
  id: 1,
  name: 'Demo User',
  email: 'demo@shopbot.com',
  password: 'demo1234'
};

const MOCK_PRODUCTS = [
  { id: 1, name: 'Margherita Pizza', price: 199, emoji: '🍕', category: 'pizza' },
  { id: 2, name: 'BBQ Chicken Pizza', price: 299, emoji: '🍕', category: 'pizza' },
  { id: 3, name: 'Pepperoni Pizza', price: 249, emoji: '🍕', category: 'pizza' },
  { id: 4, name: 'Farmhouse Pizza', price: 279, emoji: '🍕', category: 'pizza' },
  { id: 5, name: 'Creamy Alfredo Pasta', price: 179, emoji: '🍝', category: 'pasta' },
  { id: 6, name: 'Penne Arrabbiata', price: 149, emoji: '🍝', category: 'pasta' },
  { id: 7, name: 'Mac & Cheese', price: 169, emoji: '🍝', category: 'pasta' },
  { id: 8, name: 'Garlic Bread', price: 59, emoji: '🥖', category: 'sides' },
  { id: 9, name: 'Cheesy Fries', price: 89, emoji: '🍟', category: 'sides' },
  { id: 10, name: 'Chicken Wings', price: 199, emoji: '🍗', category: 'sides' },
  { id: 11, name: 'Coke', price: 49, emoji: '🥤', category: 'drinks' },
  { id: 12, name: 'Lemonade', price: 59, emoji: '🍋', category: 'drinks' },
  { id: 13, name: 'Iced Tea', price: 69, emoji: '🧊', category: 'drinks' },
  { id: 14, name: 'Chocolate Brownie', price: 99, emoji: '🍫', category: 'desserts' },
  { id: 15, name: 'Tiramisu', price: 149, emoji: '🍰', category: 'desserts' },
];

// ---------- AI Chat Logic ----------

function getAIResponse(message, cart) {
  const msg = message.toLowerCase();

  // Greeting
  if (msg.match(/\b(hi|hello|hey|sup|yo)\b/)) {
    return {
      reply: "Hey there! 👋 Welcome to ShopBot! I can help you find delicious food. Try asking me for pizzas, pastas, sides, drinks, or desserts!",
      products: [],
      action: null
    };
  }

  // Show menu / what's available
  if (msg.match(/\b(menu|everything|all|what.*(have|sell|offer|available))\b/)) {
    return {
      reply: "Here's our full menu! 🍽️ We've got pizzas, pastas, sides, drinks, and desserts. Take your pick!",
      products: MOCK_PRODUCTS,
      action: 'show_products'
    };
  }

  // Category search
  if (msg.match(/\bpizza/)) {
    const pizzas = MOCK_PRODUCTS.filter(p => p.category === 'pizza');
    return {
      reply: `🍕 Here are our ${pizzas.length} delicious pizza options! Click "Add" on any that catch your eye.`,
      products: pizzas,
      action: 'show_products'
    };
  }
  if (msg.match(/\bpasta/)) {
    const pastas = MOCK_PRODUCTS.filter(p => p.category === 'pasta');
    return {
      reply: `🍝 Check out our pasta selection! All freshly made.`,
      products: pastas,
      action: 'show_products'
    };
  }
  if (msg.match(/\b(side|fries|bread|wing|snack)/)) {
    const sides = MOCK_PRODUCTS.filter(p => p.category === 'sides');
    return {
      reply: `🥖 Here are our sides — perfect add-ons!`,
      products: sides,
      action: 'show_products'
    };
  }
  if (msg.match(/\b(drink|coke|juice|tea|lemon)/)) {
    const drinks = MOCK_PRODUCTS.filter(p => p.category === 'drinks');
    return {
      reply: `🥤 Stay refreshed! Here are our drink options.`,
      products: drinks,
      action: 'show_products'
    };
  }
  if (msg.match(/\b(dessert|sweet|brownie|cake|tiramisu)/)) {
    const desserts = MOCK_PRODUCTS.filter(p => p.category === 'desserts');
    return {
      reply: `🍰 Treat yourself to something sweet!`,
      products: desserts,
      action: 'show_products'
    };
  }

  // Price inquiry
  const priceMatch = msg.match(/price.*(?:of|for)\s+(?:the\s+)?(.+?)(?:\?|$)/);
  if (priceMatch || msg.match(/how much/)) {
    const searchTerm = priceMatch ? priceMatch[1].trim() : msg.replace(/how much.*(?:is|does|for)\s+(?:the\s+)?/i, '').trim();
    const product = MOCK_PRODUCTS.find(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    if (product) {
      return {
        reply: `The ${product.name} is ₹${product.price}. Would you like to add it to your cart?`,
        products: [],
        action: null
      };
    }
    return {
      reply: "I couldn't find that item. Could you try asking for pizzas, pastas, sides, drinks, or desserts?",
      products: [],
      action: null
    };
  }

  // Add to cart (handled on frontend directly, but respond in chat)
  if (msg.match(/\badd\b/)) {
    const addProduct = MOCK_PRODUCTS.find(p => 
      msg.includes(p.name.toLowerCase()) || 
      msg.includes(p.name.split(' ')[0].toLowerCase())
    );
    if (addProduct) {
      return {
        reply: `✅ ${addProduct.name} added to your cart! Anything else?`,
        products: [],
        action: null,
        addToCart: addProduct
      };
    }
    return {
      reply: "Which item would you like to add? I couldn't find a match. Try browsing our categories first!",
      products: [],
      action: null
    };
  }

  // Confirm order / done / checkout
  if (msg.match(/\b(confirm|done|checkout|order|pay|proceed|finish)\b/)) {
    if (cart && cart.length > 0) {
      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const itemList = cart.map(i => `${i.name} x${i.quantity}`).join(', ');
      return {
        reply: `📦 Your order: ${itemList}. Total: ₹${total}. Let me take you to checkout!`,
        products: [],
        action: 'confirm_order'
      };
    }
    return {
      reply: "Your cart is empty! Browse some products first. Try asking for 'pizzas' or 'show me the menu'.",
      products: [],
      action: null
    };
  }

  // Help
  if (msg.match(/\b(help|what can you do|how)\b/)) {
    return {
      reply: "I can help you: \n• Browse products — say \"show me pizzas\" or \"menu\"\n• Check prices — say \"price of Margherita\"\n• Manage cart — say \"add Margherita\"\n• Checkout — say \"confirm my order\"",
      products: [],
      action: null
    };
  }

  // Thanks
  if (msg.match(/\b(thanks|thank you|thx|ty)\b/)) {
    return {
      reply: "You're welcome! 😊 Let me know if you need anything else.",
      products: [],
      action: null
    };
  }

  // Default fallback
  return {
    reply: "I'm not sure I understood that. Try asking me to show you **pizzas**, **pastas**, **sides**, **drinks**, or **desserts**. Or say **menu** to see everything!",
    products: [],
    action: null
  };
}

// ---------- Delay Helper ----------
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ---------- Mock JWT ----------
function createMockToken(user) {
  const payload = { id: user.id, email: user.email, name: user.name, exp: Date.now() + 86400000 };
  return btoa(JSON.stringify(payload));
}

// ---------- Mock API Functions ----------

let mockOrderCounter = 1040;

export const mockAPI = {
  login: async (email, password) => {
    await delay(800);
    if (email === MOCK_USER.email && password === MOCK_USER.password) {
      return {
        token: createMockToken(MOCK_USER),
        user: { id: MOCK_USER.id, name: MOCK_USER.name, email: MOCK_USER.email }
      };
    }
    throw new Error('Invalid email or password');
  },

  chat: async (message, sessionId, cart) => {
    await delay(800 + Math.random() * 700);
    return getAIResponse(message, cart);
  },

  getProducts: async (ids) => {
    await delay(300);
    if (ids && ids.length > 0) {
      return MOCK_PRODUCTS.filter(p => ids.includes(p.id));
    }
    return MOCK_PRODUCTS;
  },

  createOrder: async (items, address) => {
    await delay(600);
    mockOrderCounter++;
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return {
      order_id: mockOrderCounter,
      total: total + 40, // delivery fee
      status: 'PLACED',
      items,
      address
    };
  },

  mockPayment: async (orderId) => {
    await delay(1500);
    // 90% success rate for demo
    if (Math.random() > 0.1) {
      return { success: true, txn_id: 'TXN' + Date.now() };
    }
    throw new Error('Payment failed. Please try again.');
  },

  getOrder: async (orderId) => {
    await delay(400);
    return {
      order_id: orderId,
      status: 'CONFIRMED',
      items: [],
      tracking: { current_stage: 0 }
    };
  }
};
