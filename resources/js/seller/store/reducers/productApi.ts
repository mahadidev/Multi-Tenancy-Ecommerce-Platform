import { createApi } from '@reduxjs/toolkit/query/react';
import { PREFIX } from '@seller/seller_env';
import { ApiResponseType } from '@type/apiType';
import { ProductType } from '@type/productType';
import baseQueryWithReAuth, { createRequest } from '../baseQueryWithReAuth';
import { setProduct, setTableProducts } from '../slices/productSlice';

export interface ProductsFetchResponseType extends ApiResponseType {
	data: {
		products: ProductType[];
	};
}

export interface FetchProductPayloadType {
	id: number | string;
}

export interface CreateProductPayloadType {
	name: string;
	slug: string;
	sku: string;
	category_id: number;
	price: number;
	buying_price?: number;
	discount_price?: number;
	thumbnail: string;
	attachments: string[];
}

export interface UpdateProductPayloadType {
	id: number;
	name?: string;
	slug?: string;
	category_id?: number;
	price?: number;
	thumbnail?: string;
	attachments?: string[];
}

export interface DeleteProductPayloadType {
	id: number | string;
}

export interface GenerateBarcodePayloadType {
    id: number | string;
}

export const productApi = createApi({
	reducerPath: 'productApi',
	baseQuery: baseQueryWithReAuth,
	tagTypes: ['Products', 'Product'],
	endpoints: (builder) => ({
		fetchProducts: builder.query<ProductsFetchResponseType, void>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/product`,
					method: 'get',
					body: formData,
				}),
			providesTags: ['Products'],
			transformErrorResponse: (error: any) => error.data,
			async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
				await queryFulfilled.then((response) => {
					dispatch(
						setTableProducts({
							products: response.data.data.products,
							meta: response.data.meta ?? null,
						})
					);
				});
			},
		}),
		fetchProduct: builder.query<ApiResponseType, FetchProductPayloadType>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/product/${formData.id}`,
					method: 'get',
				}),
			providesTags: ['Products'],
			transformErrorResponse: (error: any) => error.data,
			async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
				await queryFulfilled.then((response) => {
					dispatch(setProduct(response.data.data.product));
				});
			},
		}),
		createProduct: builder.mutation<ApiResponseType, CreateProductPayloadType>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/product`,
					method: 'post',
					body: formData,
				}),
			invalidatesTags: ['Products'],
			transformErrorResponse: (error: any) => error.data,
		}),
		updateProduct: builder.mutation<ApiResponseType, UpdateProductPayloadType>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/product/${formData.id}`,
					method: 'post',
					apiMethod: 'PUT',
					body: formData,
				}),
			invalidatesTags: ['Product', 'Products'],
			transformErrorResponse: (error: any) => error.data,
		}),
		deleteProduct: builder.mutation<ApiResponseType, DeleteProductPayloadType>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/product/${formData.id}`,
					method: 'post',
					apiMethod: 'DELETE',
					body: formData,
				}),
			invalidatesTags: ['Products'],
			transformErrorResponse: (error: any) => error.data,
		}),
		generateBarcode: builder.mutation<
			ApiResponseType,
			GenerateBarcodePayloadType
		>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/product/${formData.id}/barcode/generate`,
					method: 'post',
					body: formData,
				}),
			invalidatesTags: ['Products'],
			transformErrorResponse: (error: any) => error.data,
		}),
	}),
});

export const {
	useFetchProductsQuery,
	useFetchProductQuery,
	useCreateProductMutation,
	useUpdateProductMutation,
	useDeleteProductMutation,
    useGenerateBarcodeMutation
} = productApi;
