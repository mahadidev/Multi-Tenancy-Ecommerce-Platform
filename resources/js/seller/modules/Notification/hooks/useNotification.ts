import {
    notificationApi,
    useFetchNotificationsQuery,
    useMarkNotificationReadMutation,
    useMarkAllNotificationsReadMutation,
    useDeleteNotificationMutation,
} from "../store/notificationApi";
import { useAppSelector } from "@seller/store/store";
import { NotificationIdType } from "../types";

const useNotification = () => {
    // fetch notifications
    useFetchNotificationsQuery();

    // select notifications
    const { notifications, toast } = useAppSelector((state) => state.notification);

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

    // mark notification as read
    const [
        handleMarkAsRead,
        {
            isLoading: isMarkAsReadLoading,
            isError: isMarkAsReadError,
            error: markAsReadError,
            data: markAsReadData,
        },
    ] = useMarkNotificationReadMutation();
    
    const markAsRead = ({
        formData,
        onSuccess,
    }: {
        formData: NotificationIdType;
        onSuccess?: CallableFunction;
    }) => {
        handleMarkAsRead(formData).then((response) => {
            if (response.data?.status === 200) {
                if (onSuccess) {
                    onSuccess(response.data.data);
                }
            }
        });
    };

    // mark all notifications as read
    const [
        handleMarkAllAsRead,
        {
            isLoading: isMarkAllAsReadLoading,
            isError: isMarkAllAsReadError,
            error: markAllAsReadError,
            data: markAllAsReadData,
        },
    ] = useMarkAllNotificationsReadMutation();
    
    const markAllAsRead = ({
        onSuccess,
    }: {
        onSuccess?: CallableFunction;
    } = {}) => {
        handleMarkAllAsRead().then((response) => {
            if (response.data?.status === 200) {
                if (onSuccess) {
                    onSuccess(response.data.data);
                }
            }
        });
    };

    // delete notification
    const [
        handleDeleteNotification,
        {
            isLoading: isDeleteNotificationLoading,
            isError: isDeleteNotificationError,
            error: deleteNotificationError,
            data: deleteNotificationData,
        },
    ] = useDeleteNotificationMutation();
    
    const deleteNotification = ({
        formData,
        onSuccess,
    }: {
        formData: NotificationIdType;
        onSuccess?: CallableFunction;
    }) => {
        handleDeleteNotification(formData).then((response) => {
            if (response.data?.status === 200) {
                if (onSuccess) {
                    onSuccess(response.data.data);
                }
            }
        });
    };

    return {
        notifications,
        toast,
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
        markAsRead: {
            submit: markAsRead,
            isLoading: isMarkAsReadLoading,
            isError: isMarkAsReadError,
            error: markAsReadError,
            data: markAsReadData,
        },
        markAllAsRead: {
            submit: markAllAsRead,
            isLoading: isMarkAllAsReadLoading,
            isError: isMarkAllAsReadError,
            error: markAllAsReadError,
            data: markAllAsReadData,
        },
        deleteNotification: {
            submit: deleteNotification,
            isLoading: isDeleteNotificationLoading,
            isError: isDeleteNotificationError,
            error: deleteNotificationError,
            data: deleteNotificationData,
        },
    };
};

export default useNotification;