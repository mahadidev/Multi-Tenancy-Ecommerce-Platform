import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NotificationType, ToastMessageType } from "@type/notification";

const initialState: {
    toast: ToastMessageType | null;
    notifications: NotificationType[];
} = {
    toast: null,
    notifications: [],
};

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        setToast: (state, action: PayloadAction<ToastMessageType>) => {
            state.toast = action.payload;
        },
        setNotifications: (
            state,
            action: PayloadAction<NotificationType[]>
        ) => {
            state.notifications = action.payload;
        },

        clearNotifications: (state) => {
            state.notifications = [];
        },
        clearToast: (state) => {
            state.toast = null;
        },
    },
});
export const { setToast, clearToast, setNotifications, clearNotifications } =
    notificationSlice.actions;
export default notificationSlice.reducer;
