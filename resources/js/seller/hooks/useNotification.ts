import {
    notificationApi,
    NotificationIdType,
    useFetchNotificationsQuery,
} from "@seller/store/reducers/notificationApi";
import { useAppSelector } from "@seller/store/store";

const useNotification = () => {
    // fetch notifications
    useFetchNotificationsQuery();

    // select notifications
    const { notifications } = useAppSelector((state) => state.notification);

    // fetch cart items
    const [
        handleFetchSingleNotification,
        {
            isLoading: isFetchSingleNotificationLoading,
            isError: isFetchSingleNotificationError,
            error: fetchSingleNotificationError,
            data: fetchSingleNotificationData,
        },
    ] = notificationApi.endpoints.fetchSingleNotification.useLazyQuery();
    const singleNotification = ({
        formData,
        onSuccess,
    }: {
        formData: NotificationIdType;
        onSuccess?: CallableFunction;
    }) => {
        handleFetchSingleNotification(formData).then((response) => {
            if (response.data?.status === 200) {
                if (onSuccess) {
                    onSuccess(response.data.data);
                }
            }
        });
    };

    return {
        notifications,
        singleNotification: {
            submit: singleNotification,
            isLoading: isFetchSingleNotificationLoading,
            isError: isFetchSingleNotificationError,
            error: fetchSingleNotificationError,
            data: fetchSingleNotificationData,
        },
    };
};
export default useNotification;
