export interface SubscriptionPlan {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  billing_cycle: 'monthly' | 'yearly' | 'weekly' | 'daily';
  features: string[];
  is_popular?: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserSubscription {
  id: number;
  user_id: number;
  plan_id: number;
  plan: SubscriptionPlan;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  starts_at: string;
  ends_at: string;
  cancelled_at?: string;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'active' | 'cancelled' | 'expired';
  billing_cycle?: 'monthly' | 'yearly';
  sort_by?: 'name' | 'price' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

// API Response Types
export interface SubscriptionPlansResponse {
  success: boolean;
  message?: string;
  status: number;
  data: {
    plans: SubscriptionPlan[];
  };
  meta?: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface SubscriptionResponse {
  success: boolean;
  message?: string;
  status: number;
  data: {
    subscription: UserSubscription;
    payment_url?: string;
  };
}

// Payload Types (using original working format)
export interface SubscribePayload {
  package_id: number;
  amount: number | string;
}

export interface CancelSubscriptionPayload {
  subscription_id: number;
  reason?: string;
}

export interface UpdateSubscriptionPayload {
  subscription_id: number;
  plan_id?: number;
  billing_cycle?: 'monthly' | 'yearly';
}