import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './profileSlice';

const store = configureStore({
  reducer: {
    profile: profileReducer, // Add profile reducer to the store
  },
});
export default store; 