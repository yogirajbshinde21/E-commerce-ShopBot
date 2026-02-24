import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';
import LoginScreen from './screens/LoginScreen';
import ChatScreen from './screens/ChatScreen';
import OrderScreen from './screens/OrderScreen';
import DeliveryScreen from './screens/DeliveryScreen';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/chat" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={
        <PublicRoute><LoginScreen /></PublicRoute>
      } />
      <Route path="/chat" element={
        <ProtectedRoute><ChatScreen /></ProtectedRoute>
      } />
      <Route path="/order" element={
        <ProtectedRoute><OrderScreen /></ProtectedRoute>
      } />
      <Route path="/delivery" element={
        <ProtectedRoute><DeliveryScreen /></ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <OrderProvider>
          <AppRoutes />
        </OrderProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
