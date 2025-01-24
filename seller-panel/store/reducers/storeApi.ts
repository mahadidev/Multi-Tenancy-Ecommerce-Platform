import { createApi } from '@reduxjs/toolkit/query/react';
import { PREFIX } from '@seller-panel/env';
import baseQueryWithReAuth, {
    createRequest,
} from '@seller-panel/store/baseQueryWithReAuth';
import { setAuthStore } from '@seller-panel/store/slices/storeSlice';
import { ApiResponseType } from '@seller-panel/types/apiType';
import { StoreType } from '@seller-panel/types/storeType';

export interface FileFetchResponseType extends ApiResponseType {
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

export const storeApi = createApi({
	reducerPath: 'storeApi',
	baseQuery: baseQueryWithReAuth,
	tagTypes: ['Stores'],
	endpoints: (builder) => ({
		fetchStores: builder.query<FileFetchResponseType, void>({
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
                            store: response.data.data.current_store
						})
					);
				});
			},
		}),
		createStore: builder.mutation<
			FileFetchResponseType,
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
	}),
});

export const { useFetchStoresQuery, useCreateStoreMutation } = storeApi;
