import { createApi } from '@reduxjs/toolkit/query/react';
import { PREFIX } from '@seller/seller_env';
import { ApiResponseType } from '@type/apiType';
import { StoreType } from '@type/storeType';
import baseQueryWithReAuth, {
    createRequest,
} from '../baseQueryWithReAuth';
import { setAuthStore } from '../slices/storeSlice';

export interface StoresFetchResponseType extends ApiResponseType {
	data: {
		stores: StoreType[];
        current_store: StoreType
	};
}

export interface CreateStorePayloadType {
	name: string;
	slug?: string;
	domain: string;
	logo?: string;
	primaryColor?: string;
	secondaryColor?: string;
	theme_id?: number;
}

export interface UpdateStorePayloadType {
    id: number;
	name?: string;
	slug?: string;
	domain?: string;
	email?: string | null;
	phone?: string | null;
	location?: string | null;
	status?: 1 | 0;
	type?: string;
	description?: string | null;
	currency?: string;
	logo?: string;
	dark_logo?: string;
	primary_color?: null | string;
	secondary_color?: null | string;
	theme_id?: number | 'none';
}

export const storeApi = createApi({
	reducerPath: 'storeApi',
	baseQuery: baseQueryWithReAuth,
	tagTypes: ['Stores'],
	endpoints: (builder) => ({
		fetchStores: builder.query<StoresFetchResponseType, void>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/store`,
					method: 'get',
					body: formData,
				}),
			providesTags: ['Stores'],
			transformErrorResponse: (error: any) => error.data,
			async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
				await queryFulfilled.then((response) => {
					dispatch(
						setAuthStore({
							stores: response.data.data.stores,
							store: response.data.data.current_store,
						})
					);
				});
			},
		}),
		createStore: builder.mutation<
			ApiResponseType,
			CreateStorePayloadType
		>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/store`,
					method: 'post',
					body: formData,
				}),
			invalidatesTags: ['Stores'],
			transformErrorResponse: (error: any) => error.data,
		}),
		updateStore: builder.mutation<
			ApiResponseType,
			UpdateStorePayloadType
		>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/store/${formData.id}`,
					method: 'post',
					body: formData,
                    apiMethod: "PUT"
				}),
			invalidatesTags: ['Stores'],
			transformErrorResponse: (error: any) => error.data,
		}),
	}),
});

export const { useFetchStoresQuery, useCreateStoreMutation, useUpdateStoreMutation } = storeApi;
