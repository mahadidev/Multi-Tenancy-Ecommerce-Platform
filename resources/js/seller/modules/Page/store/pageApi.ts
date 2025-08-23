import { createApi } from '@reduxjs/toolkit/query/react';
import { PREFIX } from '@seller/seller_env';
import { ApiResponseType } from '@type/apiType';
import baseQueryWithReAuth, { createRequest } from '@seller/store/baseQueryWithReAuth';
import { setPage, setPageTypes, setTablePages } from './pageSlice';
import { setWidgets } from '@seller/store/slices/widgetSlice';
import {
  PagesResponse,
  PageResponse,
  PageTypesResponse,
  CreatePagePayload,
  UpdatePagePayload,
  DeletePagePayload,
  FetchPagePayload,
} from '../types';

export const pageApi = createApi({
  reducerPath: 'pageApi',
  baseQuery: baseQueryWithReAuth,
  tagTypes: ['Pages', 'Page'],
  endpoints: (builder) => ({
    fetchPages: builder.query<PagesResponse, void>({
      query: (formData) =>
        createRequest({
          url: `${PREFIX}/stores/page`,
          method: 'get',
          body: formData,
        }),
      providesTags: ['Pages'],
      transformErrorResponse: (error: any) => error.data,
      async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
        await queryFulfilled.then((response) => {
          dispatch(
            setTablePages({
              pages: response.data.data.pages,
              meta: response.data.meta ?? null,
            })
          );
        });
      },
    }),
    fetchPageTypes: builder.query<PageTypesResponse, void>({
      query: (formData) =>
        createRequest({
          url: `page-types`,
          method: 'get',
          body: formData,
        }),
      providesTags: ['Pages'],
      transformErrorResponse: (error: any) => error.data,
      async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
        await queryFulfilled.then((response) => {
          dispatch(setPageTypes(response.data.data.page_types));
        });
      },
    }),
    fetchPage: builder.query<PageResponse, FetchPagePayload>({
      query: (formData) =>
        createRequest({
          url: `${PREFIX}/stores/page/${formData.id}`,
          method: 'get',
        }),
      providesTags: ['Pages'],
      transformErrorResponse: (error: any) => error.data,
      async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
        await queryFulfilled.then((response) => {
          dispatch(setPage(response.data.data.page));
          dispatch(setWidgets(response.data.data.page.widgets));
        });
      },
    }),
    createPage: builder.mutation<ApiResponseType, CreatePagePayload>({
      query: (formData) =>
        createRequest({
          url: `${PREFIX}/stores/page`,
          method: 'post',
          body: formData,
        }),
      invalidatesTags: ['Pages'],
      transformErrorResponse: (error: any) => error.data,
    }),
    updatePage: builder.mutation<ApiResponseType, UpdatePagePayload>({
      query: (formData) =>
        createRequest({
          url: `${PREFIX}/stores/page/${formData.id}`,
          method: 'post',
          body: formData,
          apiMethod: 'PUT',
        }),
      invalidatesTags: ['Pages'],
      transformErrorResponse: (error: any) => error.data,
    }),
    deletePage: builder.mutation<ApiResponseType, DeletePagePayload>({
      query: (formData) =>
        createRequest({
          url: `${PREFIX}/stores/page/${formData.id}`,
          method: 'post',
          apiMethod: 'delete',
          body: formData,
        }),
      invalidatesTags: ['Pages'],
      transformErrorResponse: (error: any) => error.data,
    }),
  }),
});

export const {
  useFetchPagesQuery,
  useFetchPageTypesQuery,
  useCreatePageMutation,
  useUpdatePageMutation,
  useDeletePageMutation,
} = pageApi;

// Export legacy types for compatibility
export type {
  CreatePagePayload as CreatePagePayloadType,
  UpdatePagePayload as UpdatePagePayloadType,
  DeletePagePayload as DeletePagePayloadType,
  FetchPagePayload as FetchPagePayloadType,
};