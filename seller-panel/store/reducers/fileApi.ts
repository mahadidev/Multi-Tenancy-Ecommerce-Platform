import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithReAuth, { createRequest } from '@seller-panel/store/baseQueryWithReAuth';
import { ApiResponseType } from '@seller-panel/types/apiType';
import { FileType } from '@seller-panel/types/fileType';
import { setFiles } from '../slices/fileSlice';

export interface FileFetchResponseType extends ApiResponseType {
	data: {
		files: FileType[];
	};
}

export interface UploadFilePayloadType {
	type?: string;
	file: any;
	response_type?: string;
	alternate_text?: string;
	tags?: string;
}


export const fileApi = createApi({
	reducerPath: 'fileApi',
	baseQuery: baseQueryWithReAuth,
	tagTypes: ['Files'],
	endpoints: (builder) => ({
		fetchFiles: builder.query<FileFetchResponseType, void>({
			query: (formData) =>
				createRequest({
					url: `/file-storage`,
					method: 'get',
					body: formData,
				}),
			providesTags: ['Files'],
			transformErrorResponse: (error: any) => error.data,
			async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
				await queryFulfilled.then((response) => {
					dispatch(setFiles(response.data.data.files));
				});
			},
		}),
		UploadFile: builder.mutation<ApiResponseType, UploadFilePayloadType>({
			query: (formData: UploadFilePayloadType | any) => {
				const data = new FormData();
				Object.keys(formData).map((key: any) => {
					data.append(key, formData[key]);
				});

				return createRequest({
					url: `/file-storage`,
					method: 'POST',
					body: data,
				});
			},
			transformErrorResponse: (error: any) => error.data,
			invalidatesTags: ['Files'],
		}),
	}),
});

export const { useFetchFilesQuery, useUploadFileMutation } = fileApi;
