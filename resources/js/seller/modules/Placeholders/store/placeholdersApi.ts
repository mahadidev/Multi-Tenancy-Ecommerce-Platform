import { createApi } from "@reduxjs/toolkit/query/react";
import { PREFIX } from "@seller/seller_env";
import { baseQuery, createRequest } from "@seller/store/baseQueryWithReAuth";
import {
  PlaceholdersResponse,
  PlaceholderResponse,
  PlaceholderCreateResponse,
  PlaceholderUpdateResponse,
  PlaceholderDeleteResponse,
  PlaceholderCreatePayload,
  PlaceholderUpdatePayload,
  PlaceholderDeletePayload,
  PlaceholderFilters,
} from '../types';

export const placeholdersApi = createApi({
  reducerPath: "placeholdersApi",
  baseQuery: baseQuery,
  tagTypes: [
    "Placeholder",
    "Placeholders",
  ],
  endpoints: (builder) => ({
    // get all placeholders
    getPlaceholders: builder.query<PlaceholdersResponse, PlaceholderFilters | void>({
      query: (filters = {}) => {
        const queryString = new URLSearchParams(filters as Record<string, string>).toString();
        return createRequest({
          url: `${PREFIX}/placeholders?${queryString}`,
          method: "get",
        });
      },
      providesTags: ["Placeholders", "Placeholder"],
      transformErrorResponse: (error: any) => error.data,
    }),

    // get single placeholder
    getPlaceholder: builder.query<PlaceholderResponse, { id: number | string }>({
      query: ({ id }) =>
        createRequest({
          url: `${PREFIX}/placeholders/${id}`,
          method: "get",
        }),
      providesTags: (_result, _error, { id }) => [{ type: "Placeholder", id }],
      transformErrorResponse: (error: any) => error.data,
    }),

    // create placeholder
    createPlaceholder: builder.mutation<PlaceholderCreateResponse, PlaceholderCreatePayload>({
      query: (formData) =>
        createRequest({
          url: `${PREFIX}/placeholders`,
          method: "post",
          body: formData,
        }),
      invalidatesTags: ["Placeholders", "Placeholder"],
      transformErrorResponse: (error: any) => error.data,
    }),

    // update placeholder
    updatePlaceholder: builder.mutation<PlaceholderUpdateResponse, PlaceholderUpdatePayload>({
      query: ({ id, ...formData }) =>
        createRequest({
          url: `${PREFIX}/placeholders/${id}`,
          method: "put",
          body: formData,
        }),
      invalidatesTags: (_result, _error, { id }) => [
        "Placeholders",
        { type: "Placeholder", id },
      ],
      transformErrorResponse: (error: any) => error.data,
    }),

    // delete placeholder
    deletePlaceholder: builder.mutation<PlaceholderDeleteResponse, PlaceholderDeletePayload>({
      query: ({ id }) =>
        createRequest({
          url: `${PREFIX}/placeholders/${id}`,
          method: "delete",
        }),
      invalidatesTags: (_result, _error, { id }) => [
        "Placeholders",
        { type: "Placeholder", id },
      ],
      transformErrorResponse: (error: any) => error.data,
    }),

    // toggle placeholder status
    togglePlaceholder: builder.mutation<PlaceholderUpdateResponse, { id: number | string }>({
      query: ({ id }) =>
        createRequest({
          url: `${PREFIX}/placeholders/${id}/toggle`,
          method: "patch",
        }),
      invalidatesTags: (_result, _error, { id }) => [
        "Placeholders",
        { type: "Placeholder", id },
      ],
      transformErrorResponse: (error: any) => error.data,
    }),
  }),
});

export const {
  useGetPlaceholdersQuery,
  useGetPlaceholderQuery,
  useCreatePlaceholderMutation,
  useUpdatePlaceholderMutation,
  useDeletePlaceholderMutation,
  useTogglePlaceholderMutation,
} = placeholdersApi;

// Export types for use in hooks
export type {
  PlaceholderCreatePayload,
  PlaceholderUpdatePayload,
  PlaceholderFilters,
};