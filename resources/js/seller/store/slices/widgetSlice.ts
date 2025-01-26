import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WidgetInputItemType, WidgetInputType, WidgetType } from '@type/widgetType';


const initialState: {
	widgets: WidgetType[];
	widget: WidgetType | null;
	input: WidgetInputType | null;
	item: WidgetInputItemType | null;
} = {
	widgets: [],
	widget: null,
	input: null,
	item: null,
};

const widgetSlice = createSlice({
	name: 'widget',
	initialState,
	reducers: {
		setWidgets: (state, action: PayloadAction<WidgetType[]>) => {
			state.widgets = action.payload;
		},
		setWidget: (state, action: PayloadAction<WidgetType>) => {
			state.widget = action.payload;
		},
		setInput: (state, action: PayloadAction<WidgetInputType>) => {
			state.input = action.payload;
		},
		setItem: (state, action: PayloadAction<WidgetInputItemType>) => {
			state.item = action.payload;
		},
		clearWidgets: (state) => {
			state.widgets = [];
			state.input = null;
			state.item = null;
		},
	},
});
export const { setWidgets, setWidget, clearWidgets, setInput, setItem } = widgetSlice.actions;
export default widgetSlice.reducer;
