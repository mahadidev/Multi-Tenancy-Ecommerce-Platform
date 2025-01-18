import { useAppDispatch, useAppSelector } from "@/seller/store";

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
    const { onSuccess } = useAppSelector((state) => state.imageUploader);
    const [handleUpload] = useUploadImageMutation();

    const onUpload = ({ getUrl }: { getUrl: CallableFunction }) => {
        dispatch(setModalOpen(true));

        setOnSuccesss(getUrl);
    };

    const uploadImage = ({ formData }: { formData: StoreImagePayloadType }) => {
        handleUpload({
            formData: formData,
        }).then((response) => {
            if (response.data.status === 200) {
                if (onSuccess) {
                    onSuccess("yes We ddid", response);
                }
            }
        });
    };

    return { onUpload, uploadImage };
};

export default useImageUploader;
