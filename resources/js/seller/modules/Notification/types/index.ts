// Notification Module Types
export interface NotificationIdType {
    id: string;
}

export interface NotificationType {
    id: string;
    title: string;
    message: string;
    read_at: string | null;
    created_at: string;
    updated_at: string;
    user_id: string;
    type: string;
}

export interface ToastMessageType {
    text: string;
    status: "success" | "danger" | "error" | "warning" | "info";
    description?: string;
}

export interface NotificationsResponseType {
    status: number;
    message: string;
    data: {
        notifications: NotificationType[];
    };
}

export interface NotificationState {
    notifications: NotificationType[];
    toast: ToastMessageType | null;
}