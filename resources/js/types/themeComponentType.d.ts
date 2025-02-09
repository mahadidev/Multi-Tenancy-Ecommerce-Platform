import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { StoreType } from "./storeType";
import { ThemeHooksType } from "./themeHooksType";

export interface ThemeComponentPropsType {
	widget: WidgetType;
	store: StoreType;
	hooks?: ThemeHooksType;
}
