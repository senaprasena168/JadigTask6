import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Product {
  id: number;
  name: string;
  price: string;
  image?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ProductsState {
  items: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  currentProduct: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/products');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      
      if (!text || text.trim() === '') {
        return [];
      }
      
      try {
        return JSON.parse(text);
      } catch (parseError) {
        console.error('JSON parse error:', parseError, 'Raw text:', text);
        return [];
      }
    } catch (error) {
      console.error('Fetch products error:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProduct = createAsyncThunk(
  'products/fetchProduct',
  async (id: string) => {
    const response = await fetch(`/api/products/${id}`);
    return response.json();
  }
);

export const addProduct = createAsyncThunk(
  'products/addProduct',
  async (product: Omit<Product, 'id'>) => {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    return response.json();
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, ...product }: { id: number } & Partial<Product>) => {
    const response = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    return response.json();
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id: number) => {
    await fetch(`/api/products/${id}`, {
      method: 'DELETE',
    });
    return id;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      // Fetch single product
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.currentProduct = action.payload;
      })
      // Add product
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update product
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(p => p.id !== action.payload);
      });
  },
});

export const { clearCurrentProduct } = productsSlice.actions;
export default productsSlice.reducer;



