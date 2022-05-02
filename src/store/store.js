import { configureStore } from '@reduxjs/toolkit';
import istexApiReducer from './istexApiSlice';

export default configureStore({
  reducer: {
    istexApi: istexApiReducer,
  },
});
