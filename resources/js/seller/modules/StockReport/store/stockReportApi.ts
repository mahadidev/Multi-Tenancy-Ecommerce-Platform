import { createApi } from "@reduxjs/toolkit/query/react";
import { PREFIX } from "@seller/seller_env";
import baseQueryWithReAuth, { createRequest } from "../../../store/baseQueryWithReAuth";
import { setStockReport } from "./stockReportSlice";
import type { 
  StockReportResponse, 
  ExportResponse,
  FetchStockReportPayload,
  ExportStockReportPayload
} from "../types";

export const stockReportApi = createApi({
  reducerPath: "stockReportApi",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["StockReport"],
  endpoints: (builder) => ({
    fetchStockReport: builder.query<StockReportResponse, FetchStockReportPayload | void>({
      query: () =>
        createRequest({
          url: `${PREFIX}/reports/stock`,
          method: "get",
        }),
      providesTags: ["StockReport"],
      transformErrorResponse: (error: any) => error.data,
      async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
        await queryFulfilled.then((response) => {
          dispatch(
            setStockReport({
              items: response.data.data.items,
              summary: response.data.data.summary,
              meta: response.data.meta ?? undefined,
            })
          );
        });
      },
    }),

    // export stock report
    exportStockReport: builder.mutation<ExportResponse, ExportStockReportPayload>({
      query: (formData) =>
        createRequest({
          url: `${PREFIX}/reports/stock/export`,
          method: "post",
          body: formData.options,
        }),
      transformErrorResponse: (error: any) => error.data,
    }),
  }),
});

export const {
  useFetchStockReportQuery,
  useLazyFetchStockReportQuery,
  useExportStockReportMutation,
} = stockReportApi;