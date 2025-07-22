import { createApi } from '@reduxjs/toolkit/query/react';
import { PREFIX } from '@seller/seller_env';
import { ApiResponseType } from '@type/apiType';
import { ProductVariantType } from '@type/productType';
import baseQueryWithReAuth, { createRequest } from '../baseQueryWithReAuth';
import { setProductVariants } from '../slices/productVariantSlice';

export interface ProductsFetchResponseType extends ApiResponseType {
	data: {
		variants: ProductVariantType[];
	};
}

export interface FetchProductVariantPayloadType {
    productId: number | string;
}

export interface CreateProductVariantPayloadType {
	productId: number | string;
	variant: {
		label: string;
		options?: {
			label: string;
		}[];
	};
}

export interface UpdateProductVariantPayloadType {
	productId: number | string;
	variant: {
        id: number | string;
		label: string;
		options?: {
			label: string;
		}[];
	};
}

export interface DeleteProductVariantPayloadType {
	productId: number | string;
	variantId: number | string;
}

export const productVariantApi = createApi({
	reducerPath: 'productVariantApi',
	baseQuery: baseQueryWithReAuth,
	tagTypes: ['Variants', 'Variant'],
	endpoints: (builder) => ({
		fetchProductVariants: builder.query<
			ProductsFetchResponseType,
			FetchProductVariantPayloadType
		>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/products/${formData.productId}/variants`,
					method: 'get',
				}),
			providesTags: ['Variants'],
			transformErrorResponse: (error: any) => error.data,
			async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
				await queryFulfilled.then((response) => {
					dispatch(setProductVariants(response.data.data.variants));
				});
			},
		}),
		createProductVariant: builder.mutation<
			ApiResponseType,
			CreateProductVariantPayloadType
		>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/products/${formData.productId}/variants`,
					method: 'post',
					body: formData.variant,
				}),
			invalidatesTags: ['Variants'],
			transformErrorResponse: (error: any) => error.data,
		}),
		updateProductVariant: builder.mutation<
			ApiResponseType,
			UpdateProductVariantPayloadType
		>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/products/${formData.productId}/variants/${formData.variant.id}`,
					method: 'post',
					apiMethod: 'PUT',
					body: formData.variant,
				}),
			invalidatesTags: ['Variants'],
			transformErrorResponse: (error: any) => error.data,
		}),
		deleteProductVariant: builder.mutation<
			ApiResponseType,
			DeleteProductVariantPayloadType
		>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/products/${formData.productId}/variants/${formData.variantId}`,
					method: 'POST',
					apiMethod: 'DELETE',
				}),
			invalidatesTags: ['Variants'],
			transformErrorResponse: (error: any) => error.data,
		}),
	}),
});

export const {
    useFetchProductVariantsQuery,
	useCreateProductVariantMutation,
    useUpdateProductVariantMutation,
    useDeleteProductVariantMutation
} = productVariantApi;
