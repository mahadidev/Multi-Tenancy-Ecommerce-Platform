import { ResponseType } from "@/seller/types/api";
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReAuth, { createRequest } from "../baseQueryWithReAuth";

const THEME_PREFIX = "/themes";

export const themeApi = createApi({
    reducerPath: "themeApi",
    baseQuery: baseQueryWithReAuth,
    tagTypes: ["Pages"],
    endpoints: (builder) => ({
        fetchTheme: builder.query<ResponseType, string>({
            query: (slug: string) =>
                createRequest({
                    method: "get",
                    url: `${THEME_PREFIX}/${slug}`,
                }),
        }),
    }),
});

export const { useFetchThemeQuery } = themeApi;
