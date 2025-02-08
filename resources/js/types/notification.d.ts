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
    read_at: null;
}

export interface NotificationsResponseType {
    data: NotificationsResponse;
}

export interface NotificationsType {
    notifications: Notification[];
}
