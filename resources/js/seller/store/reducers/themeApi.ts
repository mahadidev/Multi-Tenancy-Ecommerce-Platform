import { ResponseType } from "@/seller/types/api";
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReAuth, { createRequest } from "../baseQueryWithReAuth";
import { setTheme, setThemes } from "../slices/themeSlice";

export const themeApi = createApi({
    reducerPath: "themeApi",
    baseQuery: baseQueryWithReAuth,
    tagTypes: [],
    endpoints: (builder) => ({
        fetchThemes: builder.query<ResponseType, void>({
            query: () =>
                createRequest({
                    url: `/themes`,
                    method: "get",
                }),
            transformErrorResponse: (error: any) => error.data,
            async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
                await queryFulfilled.then((response) => {
                    dispatch(setThemes(response.data.data.themes));
                });
            },
        }),
        fetchTheme: builder.query<ResponseType, string | number>({
            query: (id) =>
                createRequest({
                    method: "get",
                    url: `/themes/${id}`,
                }),
            transformErrorResponse: (error: any) => error.data,
            async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
                await queryFulfilled.then((response) => {
                    dispatch(setTheme(response.data.data.theme));
                });
            },
        }),
    }),
});

export const { useFetchThemesQuery, useFetchThemeQuery } = themeApi;
