import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReAuth, { createRequest } from "../baseQueryWithReAuth";

export const imageApi = createApi({
    reducerPath: "imageApi",
    baseQuery: baseQueryWithReAuth,
    tagTypes: ["Pages", "Page"],
    endpoints: (builder) => ({
        uploadImage: builder.mutation<
            any,
            {
                type: string;
                file: any;
            }
        >({
            query: (data: any) => {
                const formData = new FormData();
                // formData.append("_method", "put");

                Object.keys(data).map((key: any) => {
                    formData.append(key, data[key]);
                });

                return createRequest({
                    url: `/file-storage`,
                    method: "POST",
                    body: formData,
                });
            },
            transformResponse: (response: { data: any }) => response,
            transformErrorResponse: (error: any) => error.data,
            invalidatesTags: [],
        }),
    }),
});

export const { useUploadImageMutation } = imageApi;
