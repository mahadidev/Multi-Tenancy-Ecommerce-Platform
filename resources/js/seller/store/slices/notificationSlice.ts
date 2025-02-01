import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ToastMessageType } from '@type/notification';

const initialState: {
	toast: ToastMessageType | null;
} = {
	toast: null,
};

const notificationSlice = createSlice({
	name: 'notification',
	initialState,
	reducers: {
		setToast: (state, action: PayloadAction<ToastMessageType>) => {
			state.toast = action.payload;
		},
		clearToast: (state) => {
			state.toast = null;
		},
	},
});
export const { setToast, clearToast } = notificationSlice.actions;
export default notificationSlice.reducer;
