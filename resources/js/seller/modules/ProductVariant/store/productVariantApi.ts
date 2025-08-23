import { createApi } from "@reduxjs/toolkit/query/react";
import { PREFIX } from "@seller/seller_env";
import baseQueryWithReAuth, { createRequest } from "../../../store/baseQueryWithReAuth";
import { setProductVariants } from "./productVariantSlice";
import type { 
  ProductVariantsResponse, 
  ProductVariantResponse, 
  FetchProductVariantPayload,
  CreateProductVariantPayload, 
  UpdateProductVariantPayload, 
  DeleteProductVariantPayload
} from "../types";

export const productVariantApi = createApi({
  reducerPath: "productVariantApi",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["ProductVariant"],
  endpoints: (builder) => ({
    fetchProductVariants: builder.query<ProductVariantsResponse, FetchProductVariantPayload>({
      query: (formData) =>
        createRequest({
          url: `${PREFIX}/products/${formData.productId}/variants`,
          method: "get",
        }),
      providesTags: ["ProductVariant"],
      transformErrorResponse: (error: any) => error.data,
      async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
        await queryFulfilled.then((response) => {
          dispatch(
            setProductVariants({
              variants: response.data.data.variants,
              meta: response.data.meta ?? undefined,
            })
          );
        });
      },
    }),

    // create product variant
    createProductVariant: builder.mutation<ProductVariantResponse, CreateProductVariantPayload>({
      query: (formData) =>
        createRequest({
          url: `${PREFIX}/products/${formData.productId}/variants`,
          method: "post",
          body: formData.variant,
        }),
      invalidatesTags: ["ProductVariant"],
      transformErrorResponse: (error: any) => error.data,
    }),

    // update product variant
    updateProductVariant: builder.mutation<ProductVariantResponse, UpdateProductVariantPayload>({
      query: (formData) =>
        createRequest({
          url: `${PREFIX}/products/${formData.productId}/variants/${formData.variant.id}`,
          method: "post",
          apiMethod: "PUT",
          body: formData.variant,
        }),
      invalidatesTags: ["ProductVariant"],
      transformErrorResponse: (error: any) => error.data,
    }),

    // delete product variant
    deleteProductVariant: builder.mutation<ProductVariantResponse, DeleteProductVariantPayload>({
      query: (formData) =>
        createRequest({
          url: `${PREFIX}/products/${formData.productId}/variants/${formData.variantId}`,
          method: "post",
          apiMethod: "delete",
        }),
      invalidatesTags: ["ProductVariant"],
      transformErrorResponse: (error: any) => error.data,
    }),
  }),
});

export const {
  useFetchProductVariantsQuery,
  useCreateProductVariantMutation,
  useUpdateProductVariantMutation,
  useDeleteProductVariantMutation,
} = productVariantApi;