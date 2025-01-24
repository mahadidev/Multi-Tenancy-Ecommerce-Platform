import { createApi } from '@reduxjs/toolkit/query/react';
import { PREFIX } from '@seller-panel/env';
import baseQueryWithReAuth, {
    createRequest,
} from '@seller-panel/store/baseQueryWithReAuth';
import { ApiResponseType } from '@seller-panel/types/apiType';
import { BrandType } from '@seller-panel/types/brandType';
import { setTableBrands } from '../slices/brandSlice';

export interface BrandsFetchResponse extends ApiResponseType {
	data: {
		brands: BrandType[];
	};
}

export interface CreateBrandPayloadType {
	name: string;
	slug?: string;
	image: any;
}

export interface UpdateBrandPayloadType {
    id: number;
	name?: string;
	slug?: string;
	image?: any;
}

export interface DeleteBrandPayloadType {
    id: number
}

export const brandApi = createApi({
	reducerPath: 'brandApi',
	baseQuery: baseQueryWithReAuth,
	tagTypes: ['Brands'],
	endpoints: (builder) => ({
		fetchBrands: builder.query<BrandsFetchResponse, void>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/brand`,
					method: 'get',
					body: formData,
				}),
			providesTags: ['Brands'],
			transformErrorResponse: (error: any) => error.data,
			async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
				await queryFulfilled.then((response) => {
					dispatch(
						setTableBrands({
							brands: response.data.data.brands,
							meta: response.data.meta ?? null,
						})
					);
				});
			},
		}),
		createBrand: builder.mutation<ApiResponseType, CreateBrandPayloadType>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/brand`,
					method: 'post',
					body: formData,
				}),
			invalidatesTags: ['Brands'],
			transformErrorResponse: (error: any) => error.data,
		}),
		updateBrand: builder.mutation<ApiResponseType, UpdateBrandPayloadType>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/brand/${formData.id}`,
					method: 'post',
					apiMethod: 'PUT',
					body: formData,
				}),
			invalidatesTags: ['Brands'],
			transformErrorResponse: (error: any) => error.data,
		}),
		deleteBrand: builder.mutation<ApiResponseType, DeleteBrandPayloadType>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/brand/${formData.id}`,
					method: 'post',
					apiMethod: 'delete',
					body: formData,
				}),
			invalidatesTags: ['Brands'],
			transformErrorResponse: (error: any) => error.data,
		}),
	}),
});

export const { useFetchBrandsQuery, useCreateBrandMutation, useUpdateBrandMutation, useDeleteBrandMutation } = brandApi;
