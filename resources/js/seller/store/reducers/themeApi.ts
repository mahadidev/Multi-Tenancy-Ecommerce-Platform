import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReAuth, { createRequest } from "../baseQueryWithReAuth";

export const themeApi = createApi({
    reducerPath: "themeApi",
    baseQuery: baseQueryWithReAuth,
    tagTypes: [],
    endpoints: (builder) => ({
        fetchThemes: builder.query<any, void>({
            query: () =>
                createRequest({
                    url: `/themes`,
                    method: "get",
                }),
            transformResponse: (response) => response,
            transformErrorResponse: (error: any) => error.data,
        }),
    }),
});

export const { useFetchThemesQuery } = themeApi;
