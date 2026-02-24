# ShopBot 🛒 — AI E-Commerce Chat Interface

A single-page web application with four connected screens that simulate a complete e-commerce shopping experience driven by an AI chat agent.

## 🖥️ Screens

| # | Screen | Description |
|---|--------|-------------|
| 1 | **Login** | Email + password authentication with JWT |
| 2 | **Chat + Products** | AI chat panel + product sidebar with cart |
| 3 | **Order & Payment** | Order summary, address, simulated payment |
| 4 | **Delivery Status** | Live delivery tracking with 5 stages |

## 🚀 How to Run Locally

### Prerequisites
- **Node.js** v18+ and **npm** v9+

### Steps

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd shopbot-ecommerce

# 2. Install dependencies
npm install

# 3. (Optional) Copy env file and set backend URL
cp .env.example .env
# Edit .env if you have a real backend URL — leave empty for mock API

# 4. Start the dev server
npm run dev
```

The app will open at **http://localhost:5173**

### Test Credentials
| Field | Value |
|-------|-------|
| Email | `demo@shopbot.com` |
| Password | `demo1234` |

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 18 (Vite) |
| Routing | React Router v6 |
| Styling | Vanilla CSS (custom design system) |
| State | React Context + useState |
| HTTP Client | Fetch API |
| Auth | JWT (localStorage) |

## 📁 Project Structure

```
src/
├── api/
│   ├── api.js          # API client (mock/real)
│   └── mock.js         # Mock API with AI chat logic
├── components/
│   └── ProductSidebar.jsx
├── context/
│   ├── AuthContext.jsx  # JWT auth state
│   └── OrderContext.jsx # Cart & order state
├── screens/
│   ├── LoginScreen.jsx
│   ├── ChatScreen.jsx
│   ├── OrderScreen.jsx
│   └── DeliveryScreen.jsx
├── App.jsx             # Router + providers
├── main.jsx            # Entry point
└── index.css           # Design system
```

## 🔌 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | _(empty = mock API)_ |

## 📸 Screenshots

> Screenshots of each screen should be added here for submission.

## 🌟 Features

- ✅ JWT authentication with protected routes
- ✅ AI-powered chat with natural language processing
- ✅ Dynamic product recommendations in sidebar
- ✅ Add-to-cart with real-time cart updates
- ✅ Simulated payment flow with loading states
- ✅ 5-stage delivery tracking with auto-advance
- ✅ Toast notifications for success/error
- ✅ Typing indicator animation
- ✅ Dark glassmorphism design theme
- ✅ Responsive layout (mobile support)
- ✅ State persistence across page refresh
