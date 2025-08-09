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

interface PlanDetails {
  _id: string;
  name: string;
  mess_id: string;
  description: string;
  amount: number;
  durationDays: number;
  features: string[];
  isActive: boolean;
  maxNoOfPausePerMonth: number;
  createdAt: string;
  __v: number;
}

interface Plan {
  _id: string;
  userId: string;
  planId: PlanDetails;
  purchaseDate: string;
  isActive: boolean;
  expiryDate: string;
  messId: {
    _id: string;
    messName: string;
    messLocation: string;
    capacity: number;
    phone: string;
    email: string;
  };
  monthlyPausedDays: number;
  isPaused: boolean;
  totalPaused: number;
  __v: number;
}

interface MessState {
  nearbyMess: Mess | null;
  selectedPlan: Plan | null;
}

const initialState: MessState = {
  nearbyMess: null,
  selectedPlan: null,
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
    setSelectedPlan: (state, action: PayloadAction<Plan>) => {
      state.selectedPlan = action.payload;
    },
    clearSelectedPlan: (state) => {
      state.selectedPlan = null;
    },
  },
});

export const { setNearbyMess, clearNearbyMess, setSelectedPlan, clearSelectedPlan } = nearbyMessSlice.actions;
export const selectNearbyMess = (state: { nearbyMess: MessState }) => state.nearbyMess.nearbyMess;
export const selectSelectedPlan = (state: { nearbyMess: MessState }) => state.nearbyMess.selectedPlan;

export default nearbyMessSlice.reducer;
