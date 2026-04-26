import api from './axiosConfig';

const orderApi = {
  checkout     : (data)   => api.post('/orders/checkout', data),
  myOrders     : ()       => api.get('/orders/my'),
  getById      : (id)     => api.get(`/orders/${id}`),
  getAll       : ()       => api.get('/orders'),
  updateStatus : (id, s)  => api.put(`/orders/${id}/status`, { status: s }),
  cancel       : (id)     => api.put(`/orders/${id}/cancel`),
  cartGet      : ()       => api.get('/cart'),
  cartAdd      : (pid, q) => api.post('/cart/add', { productId: pid, quantity: q }),
  cartUpdate   : (id, q)  => api.put(`/cart/${id}`, { quantity: q }),
  cartRemove   : (id)     => api.delete(`/cart/${id}`),
  cartClear    : ()       => api.delete('/cart/clear'),
};

export default orderApi;
