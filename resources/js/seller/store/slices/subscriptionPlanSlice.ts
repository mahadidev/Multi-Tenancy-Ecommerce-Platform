import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SubscriptionType } from "@type/subscriptionPlanType";

const initialState: {
    plans: SubscriptionType[] | null;
} = {
    plans: null,
};

const subscriptionPlanSlice = createSlice({
    name: "subscriptionPlan",
    initialState,
    reducers: {
        setPlans: (state, action: PayloadAction<SubscriptionType[]>) => {
            state.plans = action.payload;
        },
        clearPlans: (state) => {
            state.plans = null;
        },
    },
});
export const { setPlans, clearPlans } = subscriptionPlanSlice.actions;
export default subscriptionPlanSlice.reducer;
