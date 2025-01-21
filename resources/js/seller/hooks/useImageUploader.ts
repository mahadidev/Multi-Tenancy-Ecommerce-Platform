import { useAppDispatch } from "@/seller/store";

import {
    StoreImagePayloadType,
    useUploadImageMutation,
} from "../store/reducers/imageApi";
import {
    setModalOpen,
    setOnSuccesss,
} from "../store/slices/imageUploaderSlice";

const useImageUploader = () => {
    const dispatch = useAppDispatch();
    const [handleUpload] = useUploadImageMutation();

    const onUpload = ({ getUrl }: { getUrl: CallableFunction }) => {
        dispatch(setModalOpen(true));

        setOnSuccesss(getUrl);
    };

    const uploadImage = ({
        formData,
        onSuccess,
    }: {
        formData: StoreImagePayloadType;
        onSuccess?: CallableFunction;
    }) => {
        handleUpload({
            formData: formData,
        }).then((response) => {
            if (response.data?.status === 200) {
                if (onSuccess) {
                    onSuccess(response.data.data);
                }
            }
        });
    };

    return { onUpload, uploadImage };
};

export default useImageUploader;
