import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  total: 0
};

export const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addProduct: (state, action) => {
      const existingProductIndex = state.products.findIndex(
        (product) => product.category === action.payload.category
      );

      if (existingProductIndex !== -1) {
        // If a product with the same category exists, remove it from the products array
        state.total -= state.products[existingProductIndex].price;
        state.products = state.products.filter(
          (product) => product.category !== action.payload.category
        );
      }

      state.products.push(action.payload);
      state.total += action.payload.price;
    },
  },
});

// Action creators are generated for each case reducer function
export const { addProduct } = productSlice.actions;

export default productSlice.reducer;
