import { createApi } from '@reduxjs/toolkit/query/react';
import { PREFIX } from '@seller-panel/env';
import baseQueryWithReAuth, {
    createRequest,
} from '@seller-panel/store/baseQueryWithReAuth';
import { ApiResponseType } from '@seller-panel/types/apiType';
import { SocialMediaType } from '@seller-panel/types/socialMediaType';
import { setTableSocialMedias } from '../slices/socialMediaSlice';

export interface SocialMediasResponseType extends ApiResponseType {
	data: {
		store_social_media: SocialMediaType[];
	};
}

export interface CreateSocialMediaPayloadType {
    name: string;
    url: string;
    username: string;
    label?: string
}

export interface UpdateSocialMediaPayloadType {
    id: number
	name?: string;
	url?: string;
	username?: string;
	label?: string;
}

export interface DeleteSocialMediaPayloadType {
	id: number;
}

export const socialMediaApi = createApi({
	reducerPath: 'socialMediaApi',
	baseQuery: baseQueryWithReAuth,
	tagTypes: ['SocialMedias'],
	endpoints: (builder) => ({
		fetchSocialMedias: builder.query<SocialMediasResponseType, void>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/store-social-media`,
					method: 'get',
					body: formData,
				}),
			providesTags: ['SocialMedias'],
			transformErrorResponse: (error: any) => error.data,
			async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
				await queryFulfilled.then((response) => {
					dispatch(
						setTableSocialMedias({
							socialMedias: response.data.data.store_social_media,
							meta: response.data.meta ?? null,
						})
					);
				});
			},
		}),
		createSocialMedia: builder.mutation<
			ApiResponseType,
			CreateSocialMediaPayloadType
		>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/store-social-media`,
					method: 'post',
					body: formData,
				}),
			invalidatesTags: ['SocialMedias'],
			transformErrorResponse: (error: any) => error.data,
		}),
		updateCategory: builder.mutation<
			ApiResponseType,
			UpdateSocialMediaPayloadType
		>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/store-social-media/${formData.id}`,
					method: 'post',
					apiMethod: 'PUT',
					body: formData,
				}),
			invalidatesTags: ['SocialMedias'],
			transformErrorResponse: (error: any) => error.data,
		}),
		deleteCategory: builder.mutation<
			ApiResponseType,
			DeleteSocialMediaPayloadType
		>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/store-social-media/${formData.id}`,
					method: 'post',
					apiMethod: 'delete',
					body: formData,
				}),
			invalidatesTags: ['SocialMedias'],
			transformErrorResponse: (error: any) => error.data,
		}),
	}),
});

export const { useFetchSocialMediasQuery, useCreateSocialMediaMutation, useDeleteCategoryMutation } = socialMediaApi;
