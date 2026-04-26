import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productApi from '../api/productApi';

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const r = await productApi.getAll(params);
      return r.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const r = await productApi.getCategories();
      return r.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items:       [],
    categories:  [],
    selected:    null,
    loading:     false,
    error:       null,
    searchQuery: '',
    activeCategory: null,
  },
  reducers: {
    setSearchQuery    : (state, action) => { state.searchQuery     = action.payload; },
    setActiveCategory : (state, action) => { state.activeCategory  = action.payload; },
    setSelected       : (state, action) => { state.selected        = action.payload; },
    clearError        : (state)         => { state.error           = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending,    (state) => { state.loading = true;  state.error = null; })
      .addCase(fetchProducts.fulfilled,  (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchProducts.rejected,   (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchCategories.fulfilled,(state, action) => { state.categories = action.payload; });
  },
});

export const { setSearchQuery, setActiveCategory, setSelected, clearError } = productSlice.actions;
export default productSlice.reducer;
