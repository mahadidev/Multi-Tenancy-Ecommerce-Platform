import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NotificationType } from "@type/notification";

const initialState: {
    notifications: NotificationType[];
} = {
    notifications: [],
};

const notificationDataSlice = createSlice({
    name: "notificationData",
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
    },
});
export const { clearNotificationData, setNotifications } =
    notificationDataSlice.actions;
export default notificationDataSlice.reducer;
