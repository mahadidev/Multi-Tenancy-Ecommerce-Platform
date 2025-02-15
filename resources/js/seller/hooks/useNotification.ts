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

    // fetch notifications
    const [
        handleRefetchNotifications,
        {
            isLoading: isRefetchNotificationsLoading,
            isError: isRefetchNotificationsError,
            error: reFetchNotificationsError,
            data: reFetchNotificationsData,
        },
    ] = notificationApi.endpoints.fetchNotifications.useLazyQuery();
    const reFetchNotifications = () => {
        handleRefetchNotifications().then(() => {});
    };

    // fetch notification items
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
        reFetchNotifications: {
            submit: reFetchNotifications,
            isLoading: isRefetchNotificationsLoading,
            isError: isRefetchNotificationsError,
            error: reFetchNotificationsError,
            data: reFetchNotificationsData,
        },
    };
};
export default useNotification;
