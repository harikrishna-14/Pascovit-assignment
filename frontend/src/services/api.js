import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  logout: () => api.post('/api/auth/logout'),
  getMe: () => api.get('/api/auth/me'),
};

// Product APIs
export const productAPI = {
  getProducts: (params) => api.get('/api/products', { params }),
  getProduct: (id) => api.get(`/api/products/${id}`),
  createProduct: (data) => api.post('/api/products', data),
  updateProduct: (id, data) => api.put(`/api/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/api/products/${id}`),
};

// Cart APIs
export const cartAPI = {
  addToCart: (data) => api.post('/api/cart/add', data),
  getCart: (params) => api.get('/api/cart', { params }),
  updateCart: (data) => api.put('/api/cart/update', data),
  removeFromCart: (data) => api.delete('/api/cart/remove', { data }),
  clearCart: (data) => api.delete('/api/cart/clear', { data }),
};

// Order APIs
export const orderAPI = {
  createOrder: (data) => api.post('/api/orders', data),
  getOrder: (id) => api.get(`/api/orders/${id}`),
  getOrders: () => api.get('/api/orders'),
  getAllOrders: () => api.get('/api/orders/admin/all'),
  updateOrderStatus: (id, data) => api.put(`/api/orders/${id}/status`, data),
};

export default api;
