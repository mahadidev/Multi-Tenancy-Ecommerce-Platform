import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NotificationType, ToastMessageType, NotificationState } from "../types";

const initialState: NotificationState = {
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

        markNotificationAsRead: (state, action: PayloadAction<string>) => {
            const notification = state.notifications.find(
                (n) => n.id === action.payload
            );
            if (notification) {
                notification.read_at = new Date().toISOString();
            }
        },

        removeNotification: (state, action: PayloadAction<string>) => {
            state.notifications = state.notifications.filter(
                (n) => n.id !== action.payload
            );
        },
    },
});

export const {
    clearNotificationData,
    setNotifications,
    setToast,
    clearToast,
    markNotificationAsRead,
    removeNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;