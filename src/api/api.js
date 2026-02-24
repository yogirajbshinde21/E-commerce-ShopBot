/**
 * API Client
 * Uses mock API by default. Set VITE_API_URL in .env to use a real backend.
 */
import { mockAPI } from './mock';

const API_URL = import.meta.env.VITE_API_URL || '';
const useMock = !API_URL;

// Helper for real API calls
async function request(method, endpoint, body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

// ---------- Exported API Functions ----------

export async function login(email, password) {
  if (useMock) return mockAPI.login(email, password);
  return request('POST', '/api/auth/login', { email, password });
}

export async function sendMessage(message, sessionId, cart) {
  if (useMock) return mockAPI.chat(message, sessionId, cart);
  const token = localStorage.getItem('token');
  return request('POST', '/api/ai/chat', { message, session_id: sessionId }, token);
}

export async function getProducts(ids) {
  if (useMock) return mockAPI.getProducts(ids);
  const token = localStorage.getItem('token');
  const query = ids ? `?ids=${ids.join(',')}` : '';
  return request('GET', `/api/products${query}`, null, token);
}

export async function createOrder(items, address) {
  if (useMock) return mockAPI.createOrder(items, address);
  const token = localStorage.getItem('token');
  return request('POST', '/api/orders', { items, address }, token);
}

export async function mockPayment(orderId) {
  if (useMock) return mockAPI.mockPayment(orderId);
  const token = localStorage.getItem('token');
  return request('POST', '/api/payments/mock', { order_id: orderId }, token);
}

export async function getOrder(orderId) {
  if (useMock) return mockAPI.getOrder(orderId);
  const token = localStorage.getItem('token');
  return request('GET', `/api/orders/${orderId}`, null, token);
}
