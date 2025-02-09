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
        setNotifications: (
            state,
            action: PayloadAction<{
                notifications: NotificationType[];
            }>
        ) => {
            state.notifications = action.payload.notifications;
        },
        clearNotificationData: (state) => {
            state.notifications = [];
        },

        setToast: (state, action: PayloadAction<ToastMessageType>) => {
            state.toast = action.payload;
        },

        clearToast: (state) => {
            state.toast = null;
        },
    },
});
export const { clearNotificationData, setNotifications, setToast, clearToast } =
    notificationSlice.actions;
export default notificationSlice.reducer;
