import {
    StorePageType,
    WidgetInputItemType,
    WidgetInputType,
    WidgetType,
} from "@/seller/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SetSelectedPayloadType {
    input: WidgetInputType;
    items?: WidgetInputItemType[];
    item?: WidgetInputItemType;
}

const initialState: {
    page: StorePageType | null;
    widgets: WidgetType[];
    widget: WidgetType | null;
    selected: SetSelectedPayloadType | null;
} = {
    page: null,
    widgets: [],
    widget: null,
    selected: null,
};
const pageSlice = createSlice({
    name: "page",
    initialState,
    reducers: {
        setPage: (state, action: PayloadAction<StorePageType>) => {
            state.page = action.payload;
        },
        setWidgets: (state, action: PayloadAction<WidgetType[]>) => {
            state.widgets = action.payload;
        },
        setWidget: (state, action: PayloadAction<WidgetType>) => {
            state.widget = action.payload;
        },
        setSelected: (state, action: PayloadAction<SetSelectedPayloadType>) => {
            state.selected = action.payload;
        },
        clearSelected: (state) => {
            state.selected = null;
        },
    },
});
export const { setPage, setWidgets, setSelected, setWidget } =
    pageSlice.actions;
export default pageSlice.reducer;
