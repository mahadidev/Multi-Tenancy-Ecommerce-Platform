import { ApiResponseType } from "./apiType";

export interface SubscriptionPlansApiResponseType extends ApiResponseType {
    data: SubscriptionPlansType;
}
export interface SubscriptionPlansType {
    subscriptions: SubscriptionType[];
}

export interface SubscriptionType {
    id: number;
    name: string;
    title: string;
    is_trend: number;
    price_monthly: string;
    features: Feature[];
    created_at: Date;
    updated_at: Date;
}

export interface Feature {
    id: number;
    name: string;
    is_available: number;
    subscription_id: number;
    created_at: Date;
    updated_at: Date;
}
