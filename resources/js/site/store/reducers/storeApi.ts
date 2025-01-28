import { createApi } from '@reduxjs/toolkit/query/react';
import { ApiResponseType } from '@type/apiType';
import { StoreType } from '@type/storeType';
import {
    baseQuery,
    createRequest,
} from '../baseQueryWithReAuth';
import { setStore } from '../slices/storeSlice';

export interface FetchStorePayloadType {
	slug: string;
}


export interface FetchStoreResponseType extends ApiResponseType {
	data: {
		store: StoreType;
	};
}

export const storeApi = createApi({
	reducerPath: 'storeApi',
	baseQuery: baseQuery,
	tagTypes: ['Store'],
	endpoints: (builder) => ({
		fetchStore: builder.query<FetchStoreResponseType, FetchStorePayloadType>({
			query: (formData) =>
				createRequest({
					url: `/store?domain=${formData.slug}`,
					method: 'get',
				}),
			providesTags: ['Store'],
			transformErrorResponse: (error: any) => error.data,
			async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
				await queryFulfilled.then((response) => {
					dispatch(setStore(response.data.data.store));
				});
			},
		}),
	}),
});

export const { useFetchStoreQuery } = storeApi;
