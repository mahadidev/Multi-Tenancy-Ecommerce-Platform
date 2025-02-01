import { clearToast, setToast } from "@seller/store/slices/notificationSlice";
import { useAppDispatch, useAppSelector } from "@seller/store/store";
import { ToastMessageType } from "@type/notification";

const useToast = () => {
    // select toast
    const { toast } = useAppSelector((state) => state.notification);

    const dispatch = useAppDispatch();

    // toast
    const toaster = (toast: ToastMessageType) => {
        dispatch(setToast(toast));

        setTimeout(() => {
            dismissToaster();
        }, 5000);
    };

    // dismiss toaster
    const dismissToaster = () => {
        dispatch(clearToast());
    };

    return { toast, toaster, dismissToaster };
};
export default useToast;
