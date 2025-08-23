import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { SubscriptionPlan, UserSubscription } from '../types';

export interface SubscriptionState {
  plans: SubscriptionPlan[];
  selectedPlan: SubscriptionPlan | null;
  currentSubscription: UserSubscription | null;
  meta?: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

const initialState: SubscriptionState = {
  plans: [],
  selectedPlan: null,
  currentSubscription: null,
  meta: undefined,
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setPlans: (
      state,
      action: PayloadAction<{
        plans: SubscriptionPlan[];
        meta?: SubscriptionState['meta'];
      }>
    ) => {
      state.plans = action.payload.plans;
      state.meta = action.payload.meta;
    },
    
    setSelectedPlan: (state, action: PayloadAction<SubscriptionPlan | null>) => {
      state.selectedPlan = action.payload;
    },
    
    setCurrentSubscription: (state, action: PayloadAction<UserSubscription | null>) => {
      state.currentSubscription = action.payload;
    },
    
    clearSubscription: (state) => {
      state.plans = [];
      state.selectedPlan = null;
      state.currentSubscription = null;
      state.meta = undefined;
    },
  },
});

export const { 
  setPlans,
  setSelectedPlan,
  setCurrentSubscription,
  clearSubscription
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;