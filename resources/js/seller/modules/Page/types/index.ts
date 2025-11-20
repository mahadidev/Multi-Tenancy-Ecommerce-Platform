import { PageTypeType } from '@type/pageType';
import { MetaType } from '@type/tableType';
import { WidgetInputType } from '@type/widgetType';

// Core Types
export type Page = PageType

export type PageType = PageTypeType

export interface PageFilters {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  is_active?: boolean;
  sort_by?: 'name' | 'created_at' | 'title';
  sort_order?: 'asc' | 'desc';
}

export interface PageFormData {
  name: string;
  title: string;
  page_type_id: string;
  slug?: string;
  is_active?: 0 | 1;
  widgets?: {
    name: string;
    label: string;
    inputs: WidgetInputType[];
  }[];
}

// API Response Types
export interface PagesResponse {
  success: boolean;
  message?: string;
  status: number;
  data: {
    pages: Page[];
  };
  meta?: MetaType;
}

export interface PageResponse {
	success: boolean;
	message?: string;
	status: number;
	data: {
		page: PageTypeType | any;
	};
}

export interface PageTypesResponse {
  success: boolean;
  message?: string;
  data: {
    page_types: PageType[];
  };
}

// Payload Types
export interface CreatePagePayload {
  name: string;
  title: string;
  page_type_id: string;
}

export interface UpdatePagePayload {
  id: number;
  name?: string;
  page_type_id?: number;
  slug?: string;
  title?: string;
  is_active?: 0 | 1;
  widgets?: {
    name: string;
    label: string;
    inputs: WidgetInputType[];
  }[];
}

export interface DeletePagePayload {
  id: number;
}

export interface FetchPagePayload {
  id: number | string;
}

// State Types
export interface PageState {
  pages: Page[];
  page: Page | null;
  pageTypes: PageType[];
  meta: MetaType | null;
  loading: boolean;
  error: string | null;
}
