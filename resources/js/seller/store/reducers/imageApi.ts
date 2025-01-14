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
                responseType?: "data";
                formData: {
                    type?: string;
                    file: any;
                    response_type?: string;
                };
            }
        >({
            query: (data: any) => {
                const formData = new FormData();
                // formData.append("_method", "put");

                Object.keys(data.formData).map((key: any) => {
                    formData.append(key, data.formData[key]);
                });

                return createRequest({
                    url: `/file-storage`,
                    method: "POST",
                    body: formData,
                });
            },
            transformResponse: (response: { data: any }, _meta, arg) => {
                if (arg.responseType == "data") {
                    return response;
                } else {
                    return response.data.location;
                }
            },
            transformErrorResponse: (error: any) => error.data,
            invalidatesTags: [],
        }),
    }),
});

export const { useUploadImageMutation } = imageApi;
