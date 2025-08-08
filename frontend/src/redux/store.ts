// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import nearbyMessReducer from './nearbyMessSlice';

export const store = configureStore({
  reducer: {
    nearbyMess: nearbyMessReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
