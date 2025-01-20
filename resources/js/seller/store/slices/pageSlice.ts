import {
    MetaType,
    PageTypeType,
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
    pages: StorePageType[];
    pagesMeta?: MetaType | null;
    pageTypes: PageTypeType[];
    page: StorePageType | null;
    widgets: WidgetType[];
    widget: WidgetType | null;
    selected: SetSelectedPayloadType | null;
} = {
    pages: [],
    pagesMeta: null,
    pageTypes: [],
    page: null,
    widgets: [],
    widget: null,
    selected: null,
};
const pageSlice = createSlice({
    name: "page",
    initialState,
    reducers: {
        setPages: (state, action: PayloadAction<StorePageType[]>) => {
            state.pages = action.payload;
        },
        setPagesMeta: (state, action: PayloadAction<MetaType | undefined>) => {
            state.pagesMeta = action.payload;
        },
        setPageTypes: (state, action: PayloadAction<PageTypeType[]>) => {
            state.pageTypes = action.payload;
        },
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
export const {
    setPages,
    setPagesMeta,
    setPageTypes,
    setPage,
    setWidgets,
    setSelected,
    setWidget,
} = pageSlice.actions;
export default pageSlice.reducer;
