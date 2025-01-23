import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithReAuth, {
    createRequest,
} from '@seller-panel/store/baseQueryWithReAuth';
import { setThemes } from '@seller-panel/store/slices/themeSlice';
import { ApiResponseType } from '@seller-panel/types/apiType';
import { ThemeType } from '@seller-panel/types/themeType';

export interface FileFetchResponseType extends ApiResponseType {
	data: {
		themes: ThemeType[];
	};
}


export const themeApi = createApi({
	reducerPath: 'themeApi',
	baseQuery: baseQueryWithReAuth,
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
	}),
});

export const { useFetchThemesQuery } = themeApi;
