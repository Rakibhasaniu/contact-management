import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import contactReducer from '../slices/contactSlice';
import profileReducer from '../slices/profileSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    contacts: contactReducer,
    profile: profileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});