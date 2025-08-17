export interface ExpenseType {
    id: number;
    title: string;
    description?: string;
    amount: number;
    formatted_amount: string;
    category: string;
    category_label: string;
    payment_method: string;
    payment_method_label: string;
    vendor_id?: number;
    vendor?: {
        id: number;
        name: string;
        phone?: string;
        email?: string;
    };
    receipt_number?: string;
    expense_date: string;
    expense_date_formatted: string;
    status: 'pending' | 'approved' | 'rejected';
    status_label: string;
    status_color: string;
    notes?: string;
    attachments: {
        path: string;
        url: string;
        name: string;
        extension: string;
    }[];
    store?: {
        id: number;
        name: string;
    };
    user?: {
        id: number;
        name: string;
        email: string;
    };
    created_at: string;
    created_at_human: string;
    updated_at: string;
    updated_at_human: string;
}