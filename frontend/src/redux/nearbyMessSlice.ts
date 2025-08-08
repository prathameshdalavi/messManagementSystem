// src/redux/nearbyMessSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface Mess {
  _id: string;
  messName: string;
  messLocation: string;
  capacity: number;
  phone: string;
  email: string;
  distance?: number;
}

interface MessState {
  nearbyMess: Mess | null;
}

const initialState: MessState = {
  nearbyMess: null,
};

const nearbyMessSlice = createSlice({
  name: 'nearbyMess',
  initialState,
  reducers: {
    setNearbyMess: (state, action: PayloadAction<Mess>) => {
      state.nearbyMess = action.payload;
    },
    clearNearbyMess: (state) => {
      state.nearbyMess = null;
    },
  },
});

export const { setNearbyMess, clearNearbyMess } = nearbyMessSlice.actions;

export const selectNearbyMess = (state: { nearbyMess: MessState }) => state.nearbyMess.nearbyMess;

export default nearbyMessSlice.reducer;
