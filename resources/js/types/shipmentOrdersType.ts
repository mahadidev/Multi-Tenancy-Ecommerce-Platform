export interface ShipmentOrdersApiResponse {
    status: number;
    data: ShipmentOrdersResponse;
}

export interface ShipmentOrdersResponse {
    shipments: ShipmentOrderType[];
}

export interface ShipmentOrderType {
    id: number;
    invoice: string;
    recipient_name: string;
    recipient_phone: string;
    recipient_address: string;
    cod_amount: string;
    note: string;
    consignment_id: number;
    tracking_code: string;
    status: string;
    order_id: number;
    store_id: number;
    created_at: string;
    updated_at: string;
}
