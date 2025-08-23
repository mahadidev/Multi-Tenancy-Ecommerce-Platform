import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReAuth, { createRequest } from "../../../store/baseQueryWithReAuth";
import { setFiles } from "./fileManagementSlice";
import type { 
  FilesResponse, 
  FileResponse, 
  UploadFilePayload, 
  UpdateFilePayload, 
  DeleteFilePayload,
  FetchFilesPayload
} from "../types";

export const fileManagementApi = createApi({
  reducerPath: "fileManagementApi",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["FileManagement"],
  endpoints: (builder) => ({
    fetchFiles: builder.query<FilesResponse, FetchFilesPayload | void>({
      query: (formData = {}) =>
        createRequest({
          url: `/file-storage`,
          method: "get",
          body: formData,
        }),
      providesTags: ["FileManagement"],
      transformErrorResponse: (error: any) => error.data,
      async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
        await queryFulfilled.then((response) => {
          dispatch(
            setFiles({
              files: response.data.data.files,
              meta: response.data.meta ?? undefined,
            })
          );
        });
      },
    }),

    // upload file
    uploadFile: builder.mutation<FileResponse, UploadFilePayload>({
      query: (formData: UploadFilePayload | any) => {
        const data = new FormData();
        Object.keys(formData).map((key: any) => {
          data.append(key, formData[key]);
        });
        return createRequest({
          url: `/file-storage`,
          method: "POST",
          body: data,
        });
      },
      invalidatesTags: ["FileManagement"],
      transformErrorResponse: (error: any) => error.data,
    }),

    // update file
    updateFile: builder.mutation<FileResponse, UpdateFilePayload>({
      query: (formData: UpdateFilePayload | any) => {
        const data = new FormData();
        Object.keys(formData).map((key: any) => {
          data.append(key, formData[key]);
        });
        return createRequest({
          url: `/file-storage/update/${formData?.id}`,
          method: "POST",
          body: data,
        });
      },
      invalidatesTags: ["FileManagement"],
      transformErrorResponse: (error: any) => error.data,
    }),

    // delete file
    deleteFile: builder.mutation<FileResponse, DeleteFilePayload>({
      query: (formData) =>
        createRequest({
          url: `/file-storage/${formData.id}`,
          method: "post",
          apiMethod: "delete",
          body: formData,
        }),
      invalidatesTags: ["FileManagement"],
      transformErrorResponse: (error: any) => error.data,
    }),
  }),
});

export const {
  useFetchFilesQuery,
  useUploadFileMutation,
  useUpdateFileMutation,
  useDeleteFileMutation,
} = fileManagementApi;