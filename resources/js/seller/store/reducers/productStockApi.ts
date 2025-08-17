import { createApi } from '@reduxjs/toolkit/query/react';
import { PREFIX } from '@seller/seller_env';
import { ApiResponseType } from '@type/apiType';
import { ProductStockType } from '@type/productType';
import baseQueryWithReAuth, { createRequest } from '../baseQueryWithReAuth';

export interface ProductStockItemInputType {
	variant_option_id: number;
}

export interface ProductsFetchStockResponseType extends ApiResponseType {
	data: {
		stocks: ProductStockType[];
	};
}

export interface FetchProductStockPayloadType {
	productId: number | string;
}

export interface CreateProductStockPayloadType {
	productId: number | string;
	stock: {
		price: number;
		buying_price: number;
		discount_amount?: number;
		qty: number;
		tax: number;
		sku: string;
		note?: string;
		items?: ProductStockItemInputType[];
	};
}

export interface UpdateProductStockPayloadType {
	productId: number | string;
	stock: {
		id: number | string;
		price: number;
		buying_price: number;
		discount_amount?: number;
		qty: number;
		tax: number;
		sku: string;
		note?: string;
		items?: ProductStockItemInputType[];
	};
}

export interface DeleteProductStockPayloadType {
	productId: number | string;
	stockId: number | string;
}

export interface FetchProductStockHistoryPayloadType {
    productId: number | string;
}

export interface ProductsStockHistoryResponseType extends ApiResponseType {
	data: {
		histories: any[];
	};
}

export const productStockApi = createApi({
	reducerPath: 'productStockApi',
	baseQuery: baseQueryWithReAuth,
	tagTypes: ['Stocks', 'Stock'],
	endpoints: (builder) => ({
		fetchProductStocks: builder.query<
			ProductsFetchStockResponseType,
			FetchProductStockPayloadType
		>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/products/${formData.productId}/stocks`,
					method: 'get',
				}),
			providesTags: (_result, _error, arg) => [
				{ type: 'Stocks', id: arg.productId },
				'Stocks'
			],
			transformErrorResponse: (error: any) => error.data,
		}),
		createProductStock: builder.mutation<
			ApiResponseType,
			CreateProductStockPayloadType
		>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/products/${formData.productId}/stocks`,
					method: 'post',
					body: formData.stock,
				}),
			invalidatesTags: (_result, _error, arg) => [
				{ type: 'Stocks', id: arg.productId },
				'Stocks'
			],
			transformErrorResponse: (error: any) => error.data,
		}),
		updateProductStock: builder.mutation<
			ApiResponseType,
			UpdateProductStockPayloadType
		>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/products/${formData.productId}/stocks/${formData.stock.id}`,
					method: 'post',
					apiMethod: 'PUT',
					body: formData.stock,
				}),
			invalidatesTags: (_result, _error, arg) => [
				{ type: 'Stocks', id: arg.productId },
				'Stocks'
			],
			transformErrorResponse: (error: any) => error.data,
		}),
		deleteProductStock: builder.mutation<
			ApiResponseType,
			DeleteProductStockPayloadType
		>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/products/${formData.productId}/stocks/${formData.stockId}`,
					method: 'POST',
					apiMethod: 'DELETE',
				}),
			invalidatesTags: (_result, _error, arg) => [
				{ type: 'Stocks', id: arg.productId },
				'Stocks'
			],
			transformErrorResponse: (error: any) => error.data,
		}),
	}),
});

export const {
	useFetchProductStocksQuery,
	useCreateProductStockMutation,
	useUpdateProductStockMutation,
	useDeleteProductStockMutation,
} = productStockApi;
