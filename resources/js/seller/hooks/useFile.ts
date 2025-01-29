import {
    UploadFilePayloadType,
    useFetchFilesQuery,
    useUploadFileMutation,
} from "@seller/store/reducers/fileApi";
import { useAppSelector } from "@seller/store/store";

const useFile = () => {
    // fetch files
    useFetchFilesQuery();
    const { files } = useAppSelector((state) => state.file);

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

    return {
        upload: {
            submit: upload,
            isLoading: isUploadLoading,
            isError: isUploadError,
            error: uploadError,
            data: uploadData,
        },
        files: files,
    };
};
export default useFile;
