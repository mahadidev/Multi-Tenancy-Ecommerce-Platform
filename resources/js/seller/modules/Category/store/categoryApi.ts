import { createApi } from '@reduxjs/toolkit/query/react';
import { PREFIX } from '@seller/seller_env';
import baseQueryWithReAuth, {
    createRequest,
} from '../../../store/baseQueryWithReAuth';
import {
    CategoriesResponse,
    Category,
    CategoryFilters,
    CategoryResponse,
    CategoryStats,
    CreateCategoryPayload,
    DeleteCategoryPayload,
    UpdateCategoryPayload,
} from '../types';
import { setCategories, setTableProductCategories } from './categorySlice';

export const categoryApi = createApi({
	reducerPath: 'categoryApi',
	baseQuery: baseQueryWithReAuth,
	tagTypes: ['Categories', 'Category', 'CategoryStats'],
	endpoints: (builder) => ({
		// Get Categories (with filters)
		getCategories: builder.query<CategoriesResponse, CategoryFilters | void>({
			query: (filters = {}) => {
				const params = new URLSearchParams();

				// Build query params from filters
				Object.entries(filters || {}).forEach(([key, value]) => {
					if (value !== undefined && value !== null && value !== '') {
						params.append(key, String(value));
					}
				});

				return createRequest({
					url: `${PREFIX}/category?${params.toString()}`,
					method: 'get',
				});
			},
			providesTags: (result) =>
				result
					? [
							...result.data.categories.map(({ id }) => ({
								type: 'Category' as const,
								id,
							})),
							{ type: 'Categories', id: 'LIST' },
					  ]
					: [{ type: 'Categories', id: 'LIST' }],
			transformErrorResponse: (error: any) => error.data,
		}),

		// Get Product Categories (backward compatibility)
		getProductCategories: builder.query<CategoriesResponse, void>({
			query: () =>
				createRequest({
					url: `${PREFIX}/category?type=product`,
					method: 'get',
				}),
			providesTags: [{ type: 'Categories', id: 'PRODUCT' }],
			transformErrorResponse: (error: any) => error.data,
			async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
				await queryFulfilled.then((response) => {
					dispatch(
						setTableProductCategories({
							categories: response.data.data.categories,
                            meta: null
						})
					);
				});
			},
		}),

		// Get Blog Categories (backward compatibility)
		getBlogCategories: builder.query<CategoriesResponse, void>({
			query: () =>
				createRequest({
					url: `${PREFIX}/category?type=post`,
					method: 'get',
				}),
			providesTags: [{ type: 'Categories', id: 'BLOG' }],
			transformErrorResponse: (error: any) => error.data,
		}),

		// Get Single Category
		getCategory: builder.query<CategoryResponse, number>({
			query: (id) =>
				createRequest({
					url: `${PREFIX}/category/${id}`,
					method: 'get',
				}),
			providesTags: (_result, _error, id) => [{ type: 'Category', id }],
			transformErrorResponse: (error: any) => error.data,
		}),

		// Create Category
		createCategory: builder.mutation<CategoryResponse, CreateCategoryPayload>({
			query: (data) =>
				createRequest({
					url: `${PREFIX}/category`,
					method: 'post',
					body: data,
				}),
			invalidatesTags: [
				{ type: 'Categories', id: 'LIST' },
				{ type: 'Categories', id: 'PRODUCT' },
				{ type: 'Categories', id: 'BLOG' },
				{ type: 'CategoryStats' },
			],
			transformErrorResponse: (error: any) => error.data,
		}),

		// Update Category
		updateCategory: builder.mutation<CategoryResponse, UpdateCategoryPayload>({
			query: (data) =>
				createRequest({
					url: `${PREFIX}/category/${data.id}`,
					method: 'post',
					apiMethod: 'PUT',
					body: data,
				}),
			invalidatesTags: (_result, _error, { id }) => [
				{ type: 'Category', id },
				{ type: 'Categories', id: 'LIST' },
				{ type: 'Categories', id: 'PRODUCT' },
				{ type: 'Categories', id: 'BLOG' },
				{ type: 'CategoryStats' },
			],
			transformErrorResponse: (error: any) => error.data,
		}),

		// Delete Category
		deleteCategory: builder.mutation<CategoryResponse, DeleteCategoryPayload>({
			query: (data) =>
				createRequest({
					url: `${PREFIX}/category/${data.id}`,
					method: 'post',
					apiMethod: 'delete',
					body: data,
				}),
			invalidatesTags: (_result, _error, { id }) => [
				{ type: 'Category', id },
				{ type: 'Categories', id: 'LIST' },
				{ type: 'Categories', id: 'PRODUCT' },
				{ type: 'Categories', id: 'BLOG' },
				{ type: 'CategoryStats' },
			],
			transformErrorResponse: (error: any) => error.data,
		}),

		// Bulk Delete Categories
		bulkDeleteCategories: builder.mutation<CategoryResponse, { ids: number[] }>(
			{
				query: (data) =>
					createRequest({
						url: `${PREFIX}/category/bulk-delete`,
						method: 'post',
						body: data,
					}),
				invalidatesTags: (_result, _error, { ids }) => [
					...ids.map((id) => ({ type: 'Category' as const, id })),
					{ type: 'Categories', id: 'LIST' },
					{ type: 'Categories', id: 'PRODUCT' },
					{ type: 'Categories', id: 'BLOG' },
					{ type: 'CategoryStats' },
				],
				transformErrorResponse: (error: any) => error.data,
			}
		),

		// Update Category Status
		updateCategoryStatus: builder.mutation<
			CategoryResponse,
			{ id: number; is_active: boolean }
		>({
			query: (data) =>
				createRequest({
					url: `${PREFIX}/category/${data.id}/status`,
					method: 'post',
					body: { is_active: data.is_active },
				}),
			invalidatesTags: (_result, _error, { id }) => [
				{ type: 'Category', id },
				{ type: 'Categories', id: 'LIST' },
				{ type: 'CategoryStats' },
			],
			transformErrorResponse: (error: any) => error.data,
		}),

		// Reorder Categories
		reorderCategories: builder.mutation<
			CategoryResponse,
			{ categories: Array<{ id: number; sort_order: number }> }
		>({
			query: (data) =>
				createRequest({
					url: `${PREFIX}/category/reorder`,
					method: 'post',
					body: data,
				}),
			invalidatesTags: [
				{ type: 'Categories', id: 'LIST' },
				{ type: 'Categories', id: 'PRODUCT' },
				{ type: 'Categories', id: 'BLOG' },
			],
			transformErrorResponse: (error: any) => error.data,
		}),

		// Get Category Tree (hierarchical)
		getCategoryTree: builder.query<
			{ data: { categories: Category[] } },
			{ type?: string }
		>({
			query: ({ type } = {}) =>
				createRequest({
					url: `${PREFIX}/category/tree${type ? `?type=${type}` : ''}`,
					method: 'get',
				}),
			providesTags: [{ type: 'Categories', id: 'TREE' }],
			transformErrorResponse: (error: any) => error.data,
		}),

		// Get Category Stats
		getCategoryStats: builder.query<{ data: CategoryStats }, { type?: string }>(
			{
				query: ({ type } = {}) =>
					createRequest({
						url: `${PREFIX}/category/stats${type ? `?type=${type}` : ''}`,
						method: 'get',
					}),
				providesTags: [{ type: 'CategoryStats' }],
				transformErrorResponse: (error: any) => error.data,
			}
		),

		// Import Categories
		importCategories: builder.mutation<
			CategoryResponse,
			{ file: File; type?: string }
		>({
			query: ({ file, type }) => {
				const formData = new FormData();
				formData.append('file', file);
				if (type) formData.append('type', type);

				return {
					url: `${PREFIX}/category/import`,
					method: 'POST',
					body: formData,
				};
			},
			invalidatesTags: [
				{ type: 'Categories', id: 'LIST' },
				{ type: 'Categories', id: 'PRODUCT' },
				{ type: 'Categories', id: 'BLOG' },
				{ type: 'CategoryStats' },
			],
			transformErrorResponse: (error: any) => error.data,
		}),

		// Export Categories
		exportCategories: builder.query<
			Blob,
			{ type?: string; format?: 'csv' | 'excel' }
		>({
			query: ({ type, format = 'csv' } = {}) => ({
				url: `${PREFIX}/category/export?format=${format}${
					type ? `&type=${type}` : ''
				}`,
				responseHandler: (response: Response) => response.blob(),
			}),
		}),
	}),
});

// Export hooks for usage in functional components
export const {
	useGetCategoriesQuery,
	useGetProductCategoriesQuery,
	useGetBlogCategoriesQuery,
	useGetCategoryQuery,
	useCreateCategoryMutation,
	useUpdateCategoryMutation,
	useDeleteCategoryMutation,
	useBulkDeleteCategoriesMutation,
	useUpdateCategoryStatusMutation,
	useReorderCategoriesMutation,
	useGetCategoryTreeQuery,
	useGetCategoryStatsQuery,
	useImportCategoriesMutation,
	useExportCategoriesQuery,
	// Lazy queries
	useLazyGetCategoriesQuery,
	useLazyGetCategoryQuery,
	useLazyGetCategoryTreeQuery,
	useLazyExportCategoriesQuery,
} = categoryApi;

// Keep backward compatibility exports
export const { useFetchProductCategoriesQuery, useFetchBlogCategoriesQuery } = {
	useFetchProductCategoriesQuery: useGetProductCategoriesQuery,
	useFetchBlogCategoriesQuery: useGetBlogCategoriesQuery,
} as const;
