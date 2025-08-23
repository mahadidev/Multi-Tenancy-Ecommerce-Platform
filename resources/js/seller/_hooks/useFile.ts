import {
    UploadFilePayloadType,
    useFetchFilesQuery,
    useUpdateFileMutation,
    useUploadFileMutation,
} from "@seller/store/reducers/fileApi";
import { useAppSelector } from "@seller/store/store";

const useFile = () => {
    // fetch files
    useFetchFilesQuery();
    const { files } = useAppSelector((state) => state.file || state.fileManagement);

    const [
        handelUpload,
        {
            isLoading: isUploadLoading,
            isError: isUploadError,
            error: uploadError,
            data: uploadData,
        },
    ] = useUploadFileMutation();
    const upload = ({
        formData,
        onSuccess,
    }: {
        formData: UploadFilePayloadType;
        onSuccess?: CallableFunction;
    }) => {
        handelUpload(formData).then((response) => {
            if (response.data?.status === 200) {
                if (onSuccess) {
                    onSuccess(response.data.data);
                }
            }
        });
    };

    const [
        handelUpdateFile,
        {
            isLoading: isUpdateFileLoading,
            isError: isUpdateFileError,
            error: updateFileError,
            data: updateFileData,
        },
    ] = useUpdateFileMutation();
    const updateFile = ({
        formData,
        onSuccess,
    }: {
        formData: UploadFilePayloadType;
        onSuccess?: CallableFunction;
    }) => {
        handelUpdateFile(formData).then((response) => {
            if (response.data?.status === 200) {
                if (onSuccess) {
                    onSuccess(response.data.data);
                }
            }
        });
    };

    return {
        upload: {
            submit: upload,
            isLoading: isUploadLoading,
            isError: isUploadError,
            error: uploadError,
            data: uploadData,
        },
        updateFile: {
            submit: updateFile,
            isLoading: isUpdateFileLoading,
            isError: isUpdateFileError,
            error: updateFileError,
            data: updateFileData,
        },
        files: files,
    };
};
export default useFile;
