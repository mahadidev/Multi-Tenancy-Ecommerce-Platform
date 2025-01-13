import { THEME_PREFIX } from "@/themes/env";
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReAuth, { createRequest } from "../baseQueryWithReAuth";

export const themeApi = createApi({
    reducerPath: "themeApi",
    baseQuery: baseQueryWithReAuth,
    tagTypes: ["Pages"],
    endpoints: (builder) => ({
        fetchTheme: builder.query<any, string>({
            query: (slug: string) =>
                createRequest({
                    method: "get",
                    url: `${THEME_PREFIX}/${slug}`,
                }),
        }),
    }),
});

export const { useFetchThemeQuery } = themeApi;
