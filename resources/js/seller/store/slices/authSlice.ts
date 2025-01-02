import { AuthType } from "@/type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the initial state using that type
const initialState: any = {
    token: "ss",
};
export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuth: (state, action: PayloadAction<AuthType>) => {},
        removeAuth: () => {},
    },
});
export const { setAuth, removeAuth } = authSlice.actions;
export default authSlice.reducer;
