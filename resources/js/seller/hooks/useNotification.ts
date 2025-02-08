import { useFetchNotificationsQuery } from "@seller/store/reducers/notificationApi";
import { useAppSelector } from "@seller/store/store";

const useNotification = () => {
    // fetch notifications
    useFetchNotificationsQuery();

    // select notifications
    const { notifications } = useAppSelector(
        (state) => state.notificationsData
    );

    return { notifications };
};
export default useNotification;
