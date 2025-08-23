import { createApi } from "@reduxjs/toolkit/query/react";
import { PREFIX } from "@seller/seller_env";
import baseQueryWithReAuth, { createRequest } from "../../../store/baseQueryWithReAuth";
import { setSocialMedias } from "./socialMediaSlice";
import type { 
  SocialMediasResponse, 
  SocialMediaResponse, 
  CreateSocialMediaPayload, 
  UpdateSocialMediaPayload, 
  DeleteSocialMediaPayload
} from "../types";

export const socialMediaApi = createApi({
  reducerPath: "socialMediaApi",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["SocialMedia"],
  endpoints: (builder) => ({
    fetchSocialMedias: builder.query<SocialMediasResponse, void>({
      query: () =>
        createRequest({
          url: `${PREFIX}/store-social-media`,
          method: "get",
        }),
      providesTags: ["SocialMedia"],
      transformErrorResponse: (error: any) => error.data,
      async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
        await queryFulfilled.then((response) => {
          dispatch(
            setSocialMedias({
              socialMedias: response.data.data.store_social_media,
              meta: response.data.meta ?? undefined,
            })
          );
        });
      },
    }),

    // create social media
    createSocialMedia: builder.mutation<SocialMediaResponse, CreateSocialMediaPayload>({
      query: (formData) =>
        createRequest({
          url: `${PREFIX}/store-social-media`,
          method: "post",
          body: formData,
        }),
      invalidatesTags: ["SocialMedia"],
      transformErrorResponse: (error: any) => error.data,
    }),

    // update social media
    updateSocialMedia: builder.mutation<SocialMediaResponse, UpdateSocialMediaPayload>({
      query: (formData) =>
        createRequest({
          url: `${PREFIX}/store-social-media/${formData.id}`,
          method: "post",
          apiMethod: "PUT",
          body: formData,
        }),
      invalidatesTags: ["SocialMedia"],
      transformErrorResponse: (error: any) => error.data,
    }),

    // delete social media
    deleteSocialMedia: builder.mutation<SocialMediaResponse, DeleteSocialMediaPayload>({
      query: (formData) =>
        createRequest({
          url: `${PREFIX}/store-social-media/${formData.id}`,
          method: "post",
          apiMethod: "delete",
          body: formData,
        }),
      invalidatesTags: ["SocialMedia"],
      transformErrorResponse: (error: any) => error.data,
    }),
  }),
});

export const {
  useFetchSocialMediasQuery,
  useCreateSocialMediaMutation,
  useUpdateSocialMediaMutation,
  useDeleteSocialMediaMutation,
} = socialMediaApi;