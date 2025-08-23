import { createApi } from "@reduxjs/toolkit/query/react";
import { PREFIX } from "@seller/seller_env";
import baseQueryWithReAuth, { createRequest } from "../../../store/baseQueryWithReAuth";
import { setProductStocks, setStockHistory, setStockSummary } from "./productStockSlice";
import type { 
  ProductStocksResponse, 
  ProductStockResponse, 
  ProductStockHistoryResponse,
  ProductStockSummaryResponse,
  FetchProductStockPayload,
  CreateProductStockPayload, 
  UpdateProductStockPayload, 
  DeleteProductStockPayload,
  FetchStockHistoryPayload,
  FetchStockSummaryPayload
} from "../types";

export const productStockApi = createApi({
  reducerPath: "productStockApi",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["ProductStock", "StockHistory", "StockSummary"],
  endpoints: (builder) => ({
    fetchProductStocks: builder.query<ProductStocksResponse, FetchProductStockPayload>({
      query: ({ productId }) =>
        createRequest({
          url: `${PREFIX}/products/${productId}/stocks`,
          method: "get",
        }),
      providesTags: ["ProductStock"],
      transformErrorResponse: (error: any) => error.data,
      async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
        await queryFulfilled.then((response) => {
          dispatch(
            setProductStocks({
              stocks: response.data.data.stocks,
              meta: response.data.meta ?? undefined,
            })
          );
        });
      },
    }),

    // create product stock
    createProductStock: builder.mutation<ProductStockResponse, CreateProductStockPayload>({
      query: ({ productId, stock }) =>
        createRequest({
          url: `${PREFIX}/products/${productId}/stocks`,
          method: "post",
          body: stock,
        }),
      invalidatesTags: ["ProductStock", "StockHistory", "StockSummary"],
      transformErrorResponse: (error: any) => error.data,
    }),

    // update product stock
    updateProductStock: builder.mutation<ProductStockResponse, UpdateProductStockPayload>({
      query: ({ productId, stock }) =>
        createRequest({
          url: `${PREFIX}/products/${productId}/stocks/${stock.id}`,
          method: "post",
          apiMethod: "PUT",
          body: stock,
        }),
      invalidatesTags: ["ProductStock", "StockHistory", "StockSummary"],
      transformErrorResponse: (error: any) => error.data,
    }),

    // delete product stock
    deleteProductStock: builder.mutation<ProductStockResponse, DeleteProductStockPayload>({
      query: ({ productId, stockId }) =>
        createRequest({
          url: `${PREFIX}/products/${productId}/stocks/${stockId}`,
          method: "post",
          apiMethod: "delete",
        }),
      invalidatesTags: ["ProductStock", "StockHistory", "StockSummary"],
      transformErrorResponse: (error: any) => error.data,
    }),

    // fetch stock history
    fetchStockHistory: builder.query<ProductStockHistoryResponse, FetchStockHistoryPayload>({
      query: (params) => {
        const queryString = new URLSearchParams(params as Record<string, string>).toString();
        return createRequest({
          url: `${PREFIX}/products/stock-histories?${queryString}`,
          method: "get",
        });
      },
      providesTags: ["StockHistory"],
      transformErrorResponse: (error: any) => error.data,
      async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
        await queryFulfilled.then((response) => {
          dispatch(
            setStockHistory({
              histories: response.data.data.histories,
              meta: response.data.meta ?? undefined,
            })
          );
        });
      },
    }),

    // fetch stock summary
    fetchStockSummary: builder.query<ProductStockSummaryResponse, FetchStockSummaryPayload>({
      query: (params) => {
        const queryString = new URLSearchParams(params as Record<string, string>).toString();
        return createRequest({
          url: `${PREFIX}/products/stocks-summary?${queryString}`,
          method: "get",
        });
      },
      providesTags: ["StockSummary"],
      transformErrorResponse: (error: any) => error.data,
      async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
        await queryFulfilled.then((response) => {
          dispatch(setStockSummary(response.data.data.summary));
        });
      },
    }),
  }),
});

export const {
  useFetchProductStocksQuery,
  useCreateProductStockMutation,
  useUpdateProductStockMutation,
  useDeleteProductStockMutation,
  useFetchStockHistoryQuery,
  useFetchStockSummaryQuery,
} = productStockApi;