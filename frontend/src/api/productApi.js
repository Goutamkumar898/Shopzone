import api from './axiosConfig';

const productApi = {
  getAll      : (params) => api.get('/products', { params }),
  getById     : (id)     => api.get(`/products/${id}`),
  getTopRated : ()       => api.get('/products', { params: { topRated: true } }),
  getByCategory: (catId) => api.get('/products', { params: { categoryId: catId } }),
  search      : (kw)     => api.get('/products', { params: { search: kw } }),
  create      : (data)   => api.post('/products', data),
  update      : (id, d)  => api.put(`/products/${id}`, d),
  delete      : (id)     => api.delete(`/products/${id}`),
  getCategories: ()      => api.get('/categories'),
  createCategory: (d)    => api.post('/categories', d),
  updateCategory: (id,d) => api.put(`/categories/${id}`, d),
  deleteCategory: (id)   => api.delete(`/categories/${id}`),
};

export default productApi;
