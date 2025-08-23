import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReAuth, { createRequest } from "../../../store/baseQueryWithReAuth";
import { setThemes, setTheme } from "./themeSlice";
import type { 
  ThemesResponse, 
  ThemeResponse, 
  FetchThemePayload,
  ActivateThemePayload,
  InstallThemePayload
} from "../types";

export const themeApi = createApi({
  reducerPath: "themeApi",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["Theme"],
  endpoints: (builder) => ({
    fetchThemes: builder.query<ThemesResponse, void>({
      query: () =>
        createRequest({
          url: `/themes`,
          method: "get",
        }),
      providesTags: ["Theme"],
      transformErrorResponse: (error: any) => error.data,
      async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
        await queryFulfilled.then((response) => {
          dispatch(
            setThemes({
              themes: response.data.data.themes,
              meta: response.data.meta ?? undefined,
            })
          );
        });
      },
    }),

    fetchTheme: builder.query<ThemeResponse, FetchThemePayload>({
      query: (formData) =>
        createRequest({
          url: `/themes/${formData.slug || formData.id}`,
          method: "get",
        }),
      transformErrorResponse: (error: any) => error.data,
      async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
        await queryFulfilled.then((response) => {
          dispatch(setTheme(response.data.data.theme));
        });
      },
    }),

    activateTheme: builder.mutation<ThemeResponse, ActivateThemePayload>({
      query: (formData) =>
        createRequest({
          url: `/themes/activate`,
          method: "post",
          body: formData,
        }),
      invalidatesTags: ["Theme"],
      transformErrorResponse: (error: any) => error.data,
    }),

    installTheme: builder.mutation<ThemeResponse, InstallThemePayload>({
      query: (formData) =>
        createRequest({
          url: `/themes/install`,
          method: "post",
          body: formData,
        }),
      invalidatesTags: ["Theme"],
      transformErrorResponse: (error: any) => error.data,
    }),
  }),
});

export const {
  useFetchThemesQuery,
  useLazyFetchThemeQuery,
  useActivateThemeMutation,
  useInstallThemeMutation,
} = themeApi;