import { WidgetInputType } from '@/seller/types';
import { createApi } from '@reduxjs/toolkit/query/react';
import { PREFIX } from '@seller-panel/env';
import baseQueryWithReAuth, {
    createRequest,
} from '@seller-panel/store/baseQueryWithReAuth';
import { setPage, setTablePages } from '@seller-panel/store/slices/pageSlice';
import { ApiResponseType } from '@seller-panel/types/apiType';
import { PageType } from '@seller-panel/types/pageType';

export interface PagesFetchResponse extends ApiResponseType {
	data: {
		pages: PageType[];
	};
}

export interface FetchPagePayloadType {
	id: number;
}

export interface CreatePagePayloadType {
    name: string;
    slug: string;
    title: string;
    is_active: boolean;
}

export interface UpdatePagePayloadType {
    id: number;
	name?: string;
	type?: string | 'home' | 'about' | 'blog' | 'contact';
	slug?: string;
	title?: string;
	is_active?: 0 | 1;
	widgets?: {
		name: string;
		label: string;
		inputs: WidgetInputType[];
	}[];
}

export interface DeletePagePayloadType {
	id: number;
}

export const pageApi = createApi({
	reducerPath: 'pageApi',
	baseQuery: baseQueryWithReAuth,
	tagTypes: ['Pages', 'Page'],
	endpoints: (builder) => ({
		fetchPages: builder.query<PagesFetchResponse, void>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/stores/page`,
					method: 'get',
					body: formData,
				}),
			providesTags: ['Pages'],
			transformErrorResponse: (error: any) => error.data,
			async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
				await queryFulfilled.then((response) => {
					dispatch(
						setTablePages({
							pages: response.data.data.pages,
							meta: response.data.meta ?? null,
						})
					);
				});
			},
		}),
		fetchPage: builder.query<ApiResponseType, FetchPagePayloadType>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/stores/page/${formData.id}`,
					method: 'get',
				}),
			providesTags: ['Pages'],
			transformErrorResponse: (error: any) => error.data,
			async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
				await queryFulfilled.then((response) => {
					dispatch(
						setPage(response.data.data.page)
					);
				});
			},
		}),
		createPage: builder.mutation<ApiResponseType, CreatePagePayloadType>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/stores/page`,
					method: 'post',
					body: formData,
				}),
			invalidatesTags: ['Pages'],
			transformErrorResponse: (error: any) => error.data,
		}),
		updatePage: builder.mutation<ApiResponseType, UpdatePagePayloadType>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/stores/page/${formData.id}`,
					method: 'post',
					body: formData,
					apiMethod: 'PUT',
				}),
			invalidatesTags: ['Pages'],
			transformErrorResponse: (error: any) => error.data,
		}),
		deletePage: builder.mutation<ApiResponseType, DeletePagePayloadType>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/stores/page/${formData.id}`,
					method: 'post',
					apiMethod: 'delete',
					body: formData,
				}),
			invalidatesTags: ['Pages'],
			transformErrorResponse: (error: any) => error.data,
		}),
	}),
});

export const {
	useFetchPagesQuery,
    useCreatePageMutation,
	useUpdatePageMutation,
	useDeletePageMutation,
} = pageApi;
