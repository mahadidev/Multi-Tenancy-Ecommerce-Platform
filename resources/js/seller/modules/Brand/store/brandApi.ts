import { createApi } from "@reduxjs/toolkit/query/react";
import { PREFIX } from "@seller/seller_env";
import baseQueryWithReAuth, { createRequest } from "../../../store/baseQueryWithReAuth";
import { setBrands } from "./brandSlice";
import type { 
  BrandsResponse, 
  BrandResponse, 
  CreateBrandPayload, 
  UpdateBrandPayload, 
  DeleteBrandPayload 
} from "../types";

export const brandApi = createApi({
  reducerPath: "brandApi",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["Brands"],
  endpoints: (builder) => ({
    fetchBrands: builder.query<BrandsResponse, void>({
      query: () =>
        createRequest({
          url: `${PREFIX}/brand`,
          method: "get",
        }),
      providesTags: ["Brands"],
      transformErrorResponse: (error: any) => error.data,
      async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
        await queryFulfilled.then((response) => {
          dispatch(
            setBrands({
              brands: response.data.data.brands,
              meta: response.data.meta ?? undefined,
            })
          );
        });
      },
    }),

    // create brand
    createBrand: builder.mutation<BrandResponse, CreateBrandPayload>({
      query: (formData) =>
        createRequest({
          url: `${PREFIX}/brand`,
          method: "post",
          body: formData,
        }),
      invalidatesTags: ["Brands"],
      transformErrorResponse: (error: any) => error.data,
    }),

    // update brand
    updateBrand: builder.mutation<BrandResponse, UpdateBrandPayload>({
      query: (formData) =>
        createRequest({
          url: `${PREFIX}/brand/${formData.id}`,
          method: "post",
          apiMethod: "PUT",
          body: formData,
        }),
      invalidatesTags: ["Brands"],
      transformErrorResponse: (error: any) => error.data,
    }),

    // delete brand
    deleteBrand: builder.mutation<BrandResponse, DeleteBrandPayload>({
      query: (formData) =>
        createRequest({
          url: `${PREFIX}/brand/${formData.id}`,
          method: "post",
          apiMethod: "delete",
          body: formData,
        }),
      invalidatesTags: ["Brands"],
      transformErrorResponse: (error: any) => error.data,
    }),
  }),
});

export const {
  useFetchBrandsQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandApi;