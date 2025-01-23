import { createApi } from '@reduxjs/toolkit/query/react';
import { PREFIX } from '@seller-panel/env';
import baseQueryWithReAuth, {
    createRequest,
} from '@seller-panel/store/baseQueryWithReAuth';
import { setTableCategories } from '@seller-panel/store/slices/categorySlice';
import { ApiResponseType } from '@seller-panel/types/apiType';
import { CategoryType } from '@seller-panel/types/categoryType';

export interface CategoriesFetchResponse extends ApiResponseType {
	data: {
		categories: CategoryType[];
	};
}

export interface CreateCategoryPayloadType {
	name: string;
    slug?: string;
    parent_id?: string
}

export interface UpdateCategoryPayloadType {
    id: number;
	name?: string;
	slug?: string;
	type?: 'product' | 'post' | 'blog';
	parent_id?: number;
}

export interface DeleteCategoryPayloadType {
    id: number
}

export const categoryApi = createApi({
	reducerPath: 'categoryApi',
	baseQuery: baseQueryWithReAuth,
	tagTypes: ['Categories'],
	endpoints: (builder) => ({
		fetchCategories: builder.query<CategoriesFetchResponse, void>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/category`,
					method: 'get',
					body: formData,
				}),
			providesTags: ['Categories'],
			transformErrorResponse: (error: any) => error.data,
			async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
				await queryFulfilled.then((response) => {
					dispatch(
						setTableCategories({
							categories: response.data.data.categories,
							meta: response.data.meta ?? null,
						})
					);
				});
			},
		}),
		createCategory: builder.mutation<
			ApiResponseType,
			CreateCategoryPayloadType
		>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/category`,
					method: 'post',
					body: formData,
				}),
			invalidatesTags: ['Categories'],
			transformErrorResponse: (error: any) => error.data,
		}),
		updateCategory: builder.mutation<
			ApiResponseType,
			UpdateCategoryPayloadType
		>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/category/${formData.id}`,
					method: 'post',
					apiMethod: 'PUT',
					body: formData,
				}),
			invalidatesTags: ['Categories'],
			transformErrorResponse: (error: any) => error.data,
		}),
		deleteCategory: builder.mutation<
			ApiResponseType,
			DeleteCategoryPayloadType
		>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/category/${formData.id}`,
					method: 'post',
					apiMethod: 'delete',
					body: formData,
				}),
			invalidatesTags: ['Categories'],
			transformErrorResponse: (error: any) => error.data,
		}),
	}),
});

export const { useFetchCategoriesQuery, useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation } = categoryApi;
