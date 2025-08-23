import { createApi } from "@reduxjs/toolkit/query/react";
import { PREFIX } from "@seller/seller_env";
import { ApiResponseType } from "@type/apiType";
import { baseQuery, createRequest } from "@seller/store/baseQueryWithReAuth";
import {
  OnboardResponse,
  OnboardStepResponse,
  OnboardStepPayload,
  CreateStorePayload,
} from '../types';

export const onboardApi = createApi({
  reducerPath: "onboardApi",
  baseQuery: baseQuery,
  tagTypes: [
    "Onboard",
    "OnboardStep",
    "Store",
  ],
  endpoints: (builder) => ({
    // get onboard status/progress
    getOnboardStatus: builder.query<OnboardStepResponse, void>({
      query: () =>
        createRequest({
          url: `${PREFIX}/onboard/status`,
          method: "get",
        }),
      providesTags: ["Onboard"],
      transformErrorResponse: (error: any) => error.data,
    }),

    // submit onboard step
    submitOnboardStep: builder.mutation<OnboardStepResponse, OnboardStepPayload>({
      query: (formData) =>
        createRequest({
          url: `${PREFIX}/onboard/step/${formData.step}`,
          method: "post",
          body: formData.data,
        }),
      invalidatesTags: ["Onboard", "OnboardStep", "Store"],
      transformErrorResponse: (error: any) => error.data,
    }),

    // create store (final onboard step)
    createStore: builder.mutation<OnboardResponse, CreateStorePayload>({
      query: (formData) =>
        createRequest({
          url: `${PREFIX}/store/create`,
          method: "post",
          body: formData,
        }),
      invalidatesTags: ["Onboard", "Store"],
      transformErrorResponse: (error: any) => error.data,
    }),

    // get store categories for onboarding
    getStoreCategories: builder.query<ApiResponseType, void>({
      query: () =>
        createRequest({
          url: `${PREFIX}/store/categories`,
          method: "get",
        }),
      providesTags: ["Store"],
      transformErrorResponse: (error: any) => error.data,
    }),
  }),
});

export const {
  useGetOnboardStatusQuery,
  useSubmitOnboardStepMutation,
  useCreateStoreMutation,
  useGetStoreCategoriesQuery,
} = onboardApi;