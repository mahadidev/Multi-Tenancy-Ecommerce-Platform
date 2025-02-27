export interface ToastMessageType {
    text: string;
    status: "success" | "danger" | "error";
    description?: string;
}

export interface NotificationType {
    id: string;
    notifiable_id: number;
    title: string;
    message: string;
    read_at: Date;
    data: NotificationDataType;
}

export interface RedirectUrlType {
    id: string;
    title: string;
    message: string;
    read_at: Date;
    data?: NotificationDataType;
}

export interface NotificationsResponseType {
    data: NotificationsResponse;
}

export interface NotificationsType {
    notifications: Notification[];
}

export interface NotificationDataType {
    module: string;
    order_id: number;
    order_uuid: string;
    store_id: number;
    store_name: string;
    title: string;
    message: string;
    amount: number;
    status: string;
}
