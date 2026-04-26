import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    count: 0,
    total: 0,
  },
  reducers: {
    setCartSummary: (state, action) => {
      state.count = action.payload.count;
      state.total = action.payload.total;
    },
    resetCart: (state) => {
      state.count = 0;
      state.total = 0;
    },
  },
});

export const { setCartSummary, resetCart } = cartSlice.actions;
export default cartSlice.reducer;
