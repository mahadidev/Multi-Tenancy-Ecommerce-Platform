import { createApi } from '@reduxjs/toolkit/query/react';
import { PREFIX } from '@seller/seller_env';
import { ApiResponseType } from '@type/apiType';
import { CategoryType } from '@type/categoryType';
import baseQueryWithReAuth, {
    createRequest,
} from '../baseQueryWithReAuth';

import { setBlogTableCategories } from '../slices/blogCategorySlice';

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

export const blogCategoryApi = createApi({
	reducerPath: 'blogCategoryApi',
	baseQuery: baseQueryWithReAuth,
	tagTypes: ['blog_Categories'],
	endpoints: (builder) => ({
		fetchBlogCategories: builder.query<CategoriesFetchResponse, void>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/blog-category?type=post`,
					method: 'get',
					body: formData,
				}),
			providesTags: ['blog_Categories'],
			transformErrorResponse: (error: any) => error.data,
			async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
				await queryFulfilled.then((response) => {
					dispatch(
						setBlogTableCategories({
							categories: response.data.data.categories,
							meta: response.data.meta ?? null,
						})
					);
				});
			},
		}),
		createBlogCategory: builder.mutation<
			ApiResponseType,
			CreateCategoryPayloadType
		>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/blog-category`,
					method: 'post',
					body: formData,
				}),
			invalidatesTags: ['blog_Categories'],
			transformErrorResponse: (error: any) => error.data,
		}),
		updateBlogCategory: builder.mutation<
			ApiResponseType,
			UpdateCategoryPayloadType
		>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/blog-category/${formData.id}`,
					method: 'post',
					apiMethod: 'PUT',
					body: formData,
				}),
			invalidatesTags: ['blog_Categories'],
			transformErrorResponse: (error: any) => error.data,
		}),
		deleteBlogCategory: builder.mutation<
			ApiResponseType,
			DeleteCategoryPayloadType
		>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/blog-category/${formData.id}`,
					method: 'post',
					apiMethod: 'delete',
					body: formData,
				}),
			invalidatesTags: ['blog_Categories'],
			transformErrorResponse: (error: any) => error.data,
		}),
	}),
});

export const {
	 useFetchBlogCategoriesQuery,
	 useCreateBlogCategoryMutation,
	 useUpdateBlogCategoryMutation,
	 useDeleteBlogCategoryMutation } = blogCategoryApi;
