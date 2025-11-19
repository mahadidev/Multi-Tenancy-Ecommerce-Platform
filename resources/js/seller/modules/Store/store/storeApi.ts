import { createApi } from '@reduxjs/toolkit/query/react';
import { API_URL, PREFIX } from '@seller/seller_env';
import baseQueryWithReAuth, {
    createRequest,
} from '@seller/store/baseQueryWithReAuth';
import { ApiResponseType } from '@type/apiType';
import {
    CreateStoreAdminPayload,
    CreateStorePayload,
    DeleteStoreAdminPayload,
    StoreAdminsResponse,
    StoresResponse,
    StoreTypesResponse,
    SwitchStorePayload,
    SwitchThemePayload,
    UpdateStoreAdminPayload,
    UpdateStorePayload,
} from '../types';
import {
    clearStore,
    setAdmins,
    setAuthStore,
    setStoreTypes,
} from './storeSlice';

export const storeApi = createApi({
	reducerPath: 'storeApi',
	baseQuery: baseQueryWithReAuth,
	tagTypes: ['Stores', 'Types', 'Admins'],
	endpoints: (builder) => ({
		fetchStores: builder.query<StoresResponse, void>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/store`,
					method: 'get',
					body: formData,
				}),
			providesTags: ['Stores'],
			transformErrorResponse: (error: any) => error.data,
			async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
				try {
					const response = await queryFulfilled;
					dispatch(
						setAuthStore({
							stores: response.data.data.stores,
							currentStore: response.data.data.current_store,
							store: response.data.data.current_store,
						})
					);
				} catch (error: any) {
					// if store not authorized
					if (error.meta.response.status === 403) {
                        console.log("Store is cleared");
						dispatch(clearStore());
					}
				}
			},
		}),
		fetchStoreTypes: builder.query<StoreTypesResponse, void>({
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
		fetchAdmins: builder.query<StoreAdminsResponse, void>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/store-admin`,
					method: 'get',
					body: formData,
				}),
			providesTags: ['Admins'],
			transformErrorResponse: (error: any) => error.data,
			async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
				await queryFulfilled.then((response) => {
					dispatch(
						setAdmins({
							admins: response?.data?.data?.store_admins,
						})
					);
				});
			},
		}),
		createStore: builder.mutation<ApiResponseType, CreateStorePayload>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/store`,
					method: 'post',
					body: formData,
				}),
			invalidatesTags: ['Stores'],
			transformErrorResponse: (error: any) => error.data,
		}),
		updateStore: builder.mutation<ApiResponseType, UpdateStorePayload>({
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
		switchTheme: builder.mutation<ApiResponseType, SwitchThemePayload>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/store/switch-theme/${formData.store_id}`,
					method: 'post',
					body: formData,
				}),
			invalidatesTags: ['Stores'],
			transformErrorResponse: (error: any) => error.data,
		}),
		switchStore: builder.mutation<ApiResponseType, SwitchStorePayload>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/switch-store`,
					method: 'post',
					body: formData,
				}),
			invalidatesTags: ['Stores'],
			transformErrorResponse: (error: any) => error.data,
		}),
		createAdmin: builder.mutation<ApiResponseType, CreateStoreAdminPayload>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/store-admin`,
					method: 'post',
					body: formData,
				}),
			invalidatesTags: ['Admins'],
			transformErrorResponse: (error: any) => error.data,
		}),
		updateAdmin: builder.mutation<ApiResponseType, UpdateStoreAdminPayload>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/store-admin/${formData.id}`,
					method: 'post',
					apiMethod: 'PUT',
					body: formData,
				}),
			invalidatesTags: ['Admins'],
			transformErrorResponse: (error: any) => error.data,
		}),
		deleteAdmin: builder.mutation<ApiResponseType, DeleteStoreAdminPayload>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/store-admin/${formData.id}`,
					method: 'delete',
					body: formData,
				}),
			invalidatesTags: ['Admins'],
			transformErrorResponse: (error: any) => error.data,
		}),
	}),
});

export const {
	useFetchStoresQuery,
	useFetchStoreTypesQuery,
	useFetchAdminsQuery,
	useCreateStoreMutation,
	useUpdateStoreMutation,
	useSwitchStoreMutation,
	useSwitchThemeMutation,
	useCreateAdminMutation,
	useUpdateAdminMutation,
	useDeleteAdminMutation,
} = storeApi;

// Export legacy types for compatibility
export type {
    DeleteStoreAdminPayload as AdminIdType,
    CreateStorePayload as CreateStorePayloadType,
    SwitchStorePayload as SwitchStorePayloadType,
    SwitchThemePayload as SwitchThemePayloadType,
    UpdateStorePayload as UpdateStorePayloadType
};

