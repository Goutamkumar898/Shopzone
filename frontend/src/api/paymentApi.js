import api from './axiosConfig';

const paymentApi = {
  process  : (orderId, method) => api.post(`/payments/process/${orderId}`, { paymentMethod: method }),
  getByOrder: (orderId)        => api.get(`/payments/order/${orderId}`),
  refund   : (paymentId)       => api.post(`/payments/${paymentId}/refund`),
};

export default paymentApi;
