import { createApi } from "@reduxjs/toolkit/query/react";
import { API_URL, PREFIX } from "@seller/seller_env";
import { ApiResponseType } from "@type/apiType";
import { StoreType, StoreTypeData } from "@type/storeType";
import baseQueryWithReAuth, { createRequest } from "../baseQueryWithReAuth";
import { setAuthStore, setStoreTypes } from "../slices/storeSlice";
import { setTheme } from "../slices/themeSlice";

export interface StoresFetchResponseType extends ApiResponseType {
    data: {
        stores: StoreType[];
        current_store: StoreType;
    };
}
export interface StoreTypesResponseType extends ApiResponseType {
    data: StoreTypeData;
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
    theme_id?: number | "none";
}

export interface SwitchStorePayloadType {
    store_id: number;
}

export const storeApi = createApi({
	reducerPath: 'storeApi',
	baseQuery: baseQueryWithReAuth,
	tagTypes: ['Stores', 'Types'],
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
							currentStore: response.data.data.current_store,
							store: response.data.data.current_store,
						})
					);
					dispatch(setTheme(response.data.data.current_store.theme));
				});
			},
		}),
		fetchStoreTypes: builder.query<StoreTypesResponseType, void>({
			query: (formData) =>
				createRequest({
					url: `${API_URL}/store-types`,
					method: 'get',
					body: formData,
				}),
			providesTags: ['Types'],
			transformErrorResponse: (error: any) => error.data,
			async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
				await queryFulfilled.then((response) => {
					dispatch(setStoreTypes(response.data.data.store_types));
				});
			},
		}),
		createStore: builder.mutation<ApiResponseType, CreateStorePayloadType>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/store`,
					method: 'post',
					body: formData,
				}),
			invalidatesTags: ['Stores'],
			transformErrorResponse: (error: any) => error.data,
		}),
		updateStore: builder.mutation<ApiResponseType, UpdateStorePayloadType>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/store/${formData.id}`,
					method: 'post',
					body: formData,
					apiMethod: 'PUT',
				}),
			invalidatesTags: ['Stores'],
			transformErrorResponse: (error: any) => error.data,
		}),
		switchStore: builder.mutation<ApiResponseType, SwitchStorePayloadType>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/switch-store`,
					method: 'post',
					body: formData,
				}),
			invalidatesTags: ['Stores'],
			transformErrorResponse: (error: any) => error.data,
		}),
	}),
});

export const {
    useFetchStoresQuery,
    useFetchStoreTypesQuery,
    useCreateStoreMutation,
    useUpdateStoreMutation,
    useSwitchStoreMutation,
} = storeApi;
