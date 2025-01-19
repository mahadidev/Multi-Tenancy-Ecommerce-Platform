import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReAuth, { createRequest } from "../baseQueryWithReAuth";

export interface StoreImagePayloadType {
    type?: string;
    file: any;
    response_type?: string;
    alternate_text?: string;
    tags?: string;
}

export const imageApi = createApi({
    reducerPath: "imageApi",
    baseQuery: baseQueryWithReAuth,
    tagTypes: ["Images", "Page"],
    endpoints: (builder) => ({
        fetchImages: builder.query<any, void>({
            query: () => {
                return createRequest({
                    url: `/file-storage`,
                    method: "GET",
                });
            },
            transformResponse: (response: ResponseType) => {
                return response;
            },
            transformErrorResponse: (error: any) => error.data,
            providesTags: ["Images"],
        }),
        uploadImage: builder.mutation<
            any,
            {
                formData: StoreImagePayloadType;
            }
        >({
            query: (data: any) => {
                const formData = new FormData();
                Object.keys(data.formData).map((key: any) => {
                    formData.append(key, data.formData[key]);
                });

                return createRequest({
                    url: `/file-storage`,
                    method: "POST",
                    body: formData,
                });
            },
            transformResponse: (response: any) => response,
            transformErrorResponse: (error: any) => error.data,
            invalidatesTags: ["Images"],
        }),
    }),
});

export const { useFetchImagesQuery, useUploadImageMutation } = imageApi;
