import { createApi } from '@reduxjs/toolkit/query/react';
import { ApiResponseType } from '@type/apiType';
import { ThemeType } from '@type/themeType';
import {
    baseQuery,
    createRequest,
} from '../baseQueryWithReAuth';
import { setTheme, setThemes } from '../slices/themeSlice';

export interface FileFetchResponseType extends ApiResponseType {
	data: {
		themes: ThemeType[];
	};
}

export interface FetchThemePayloadType {
    id?: number;
    slug?: string;
    idOrSlug: string
}


export const themeApi = createApi({
	reducerPath: 'themeApi',
	baseQuery: baseQuery,
	tagTypes: ['Themes'],
	endpoints: (builder) => ({
		fetchThemes: builder.query<FileFetchResponseType, void>({
			query: (formData) =>
				createRequest({
					url: `/themes`,
					method: 'get',
					body: formData,
				}),
			providesTags: ['Themes'],
			transformErrorResponse: (error: any) => error.data,
			async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
				await queryFulfilled.then((response) => {
					dispatch(setThemes(response.data.data.themes));
				});
			},
		}),
		fetchTheme: builder.query<ApiResponseType, FetchThemePayloadType>({
			query: (data) =>
				createRequest({
					method: 'get',
					url: `/themes/${data.idOrSlug}`,
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
