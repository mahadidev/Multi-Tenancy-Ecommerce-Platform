import { createApi } from "@reduxjs/toolkit/query/react";
import { PREFIX } from "@seller/seller_env";
import baseQueryWithReAuth, { createRequest } from "../../../store/baseQueryWithReAuth";
import { setBrands } from "./brandSlice";
import type { 
  BrandsResponse, 
  BrandResponse, 
  CreateBrandPayload, 
  UpdateBrandPayload, 
  DeleteBrandPayload,
  BrandFilters
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

    // Fetch brands with table filters (for generic table)
    fetchBrandsTable: builder.query<BrandsResponse, BrandFilters>({
      query: (filters) => {
        const params = new URLSearchParams();
        
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, String(value));
          }
        });
        
        return createRequest({
          url: `${PREFIX}/brand?${params.toString()}`,
          method: "get",
        });
      },
      providesTags: ["Brands"],
      transformErrorResponse: (error: any) => error.data,
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
  useFetchBrandsTableQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandApi;