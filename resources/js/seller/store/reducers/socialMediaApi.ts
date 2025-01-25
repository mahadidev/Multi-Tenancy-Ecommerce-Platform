import { ResponseType } from "@/seller/types/api";
import { createApi } from "@reduxjs/toolkit/query/react";
import { DeleteSocialMediaPayloadType } from "@seller-panel/store/reducers/socialMediaApi";
import baseQueryWithReAuth, { createRequest } from "../baseQueryWithReAuth";
import { SELLER_PREFIX } from "../env";
import {
    setSocialMedias,
    setSocialMediasMeta,
} from "../slices/socialMediaSlice";

export interface StoreBrandPayloadType {
    name: string;
    slug: string;
    image: any;
}

export interface UpdateCategoryPayloadType {
    name?: string;
    slug?: string;
    image?: any;
}

export interface StoreSocialMediaPayloadType {
    name: string;
    label: string;
    username: string;
    url: string;
}

export const socialMediaApi = createApi({
    reducerPath: "socialMediaApi",
    baseQuery: baseQueryWithReAuth,
    tagTypes: ["Brands", "SocialMedias"],
    endpoints: (builder) => ({
        fetchSocialMedias: builder.query<ResponseType, void>({
            query: () => {
                return createRequest({
                    url: `${SELLER_PREFIX}/store-social-media`,
                    method: "GET",
                });
            },
            transformErrorResponse: (error: any) => error.data,
            providesTags: ["SocialMedias"],
            async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
                await queryFulfilled.then((response) => {
                    dispatch(
                        setSocialMedias(response.data.data.store_social_media)
                    );
                    dispatch(setSocialMediasMeta(response.data.meta));
                });
            },
        }),
        storeSocialMedia: builder.mutation<
            ResponseType,
            {
                formData: StoreSocialMediaPayloadType;
            }
        >({
            query: (data) => {
                return createRequest({
                    url: `${SELLER_PREFIX}/store-social-media`,
                    method: "POST",
                    body: data.formData,
                });
            },
            transformErrorResponse: (error: any) => error.data,
            invalidatesTags: ["SocialMedias"],
        }),
        deleteSocialMedia: builder.mutation<
            ResponseType,
            DeleteSocialMediaPayloadType
        >({
            query: (data) => {
                return createRequest({
                    url: `${SELLER_PREFIX}/store-social-media/${data.id}`,
                    method: "POST",
                    body: {
                        _method: "DELETE",
                    },
                });
            },
            transformResponse: (response: any) => response,
            transformErrorResponse: (error: any) => error.data,
            invalidatesTags: ["SocialMedias"],
        }),
    }),
});

export const {
    useFetchSocialMediasQuery,
    useStoreSocialMediaMutation,
    useDeleteSocialMediaMutation,
} = socialMediaApi;
