<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $isCustomer ? 'Order Confirmation' : 'New Order Notification' }}</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.4;
            color: #2d3748;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 800px;
            margin: 20px auto;
            padding: 40px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            position: relative;
            overflow: hidden;
        }

        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #edf2f7;
            margin-bottom: 20px;
        }

        h1 {
            color: #1a202c;
            font-size: 24px;
            font-weight: 600;
            margin: 0;
        }

        .logo {
            max-width: 150px;
            /* Reduced logo size */
            margin-bottom: 15px;
            /* Reduced margin */
        }

        h2 {
            color: #2d3748;
            font-size: 20px;
            /* Slightly smaller font size */
            font-weight: 600;
            text-align: center !important;
            padding-left: 30%;
            padding-right: 30%;
            padding-top: 100px;
        }

        h3 {
            color: #2d3748;
            font-size: 20px;
            /* Slightly smaller font size */
            font-weight: 600;
        }

        .order-details {
            display: flex;
            flex-wrap: wrap;
            margin: 15px 0;
            gap: 15px;
        }

        .d-flex {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .col-md-6 {
            width: 45%;
            float: left;
            padding: 0px;
            box-sizing: border-box;
        }

        .col-md-6-left {
            width: 54%;
            float: right;
            padding: 0px;
            box-sizing: border-box;
        }

        .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
        }

        .info-label {
            font-size: 13px;
            color: #64748b;
            font-weight: 500;
        }

        .info-value {
            font-size: 14px;
            color: #1a202c;
            font-weight: 500;
        }

        .content {
            position: relative;
            z-index: 2;
            background-color: rgba(255, 255, 255, 0.9);
        }

        table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            margin: 15px 0;
            font-size: 14px;
            position: relative;
            z-index: 3;
        }

        table th {
            background-color: #f8fafc;
            padding: 12px;
            text-align: left;
            font-weight: 600;
            color: #1a202c;
            border-bottom: 1px solid #e2e8f0;
        }

        table td {
            padding: 12px;
            border-bottom: 1px solid #e2e8f0;
            background-color: rgba(255, 255, 255, 0.95);
        }

        .total-row td {
            font-weight: 700;
            background-color: #f1f5f9;
        }


        .footer {
            text-align: center;
            padding-top: 15px;
            /* Reduced padding */
            border-top: 1px solid #edf2f7;
            /* Thinner border */
            color: #718096;
            font-size: 13px;
            /* Slightly smaller font size */
        }

        .company-info {
            margin-top: 10px;
            /* Reduced margin */
            font-size: 12px;
            /* Slightly smaller font size */
        }

        @media print {
            body {
                background-color: #ffffff;
            }

            .container {
                box-shadow: none;
                margin: 0;
                padding: 10px;
                /* Reduced padding for print */
            }

            .button {
                display: none;
            }
        }

        
        .store-info-line {
            display: flex;
            align-items: center;
            justify-content: center;
            padding bottom: 10px;
            flex-wrap: wrap;
            font-size: 13px;
            color: #64748b;
        }

        .store-info-item {
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .store-info-item i {
            font-size: 14px;
            color: #64748b;
        }

        .store-info-value {
            color: #1e293b;
        }
        .page-footer {
            position: fixed;
            bottom: -40px;
            left: 0;
            right: 0;
            text-align: right;
            font-size: 10px;
            color: #666;
            width: 100%;
        }

        .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            width: 100%;
            height: 120%;
            background-image: url('data:image/png;base64,{{ base64_encode(file_get_contents(public_path($store->logo ? 'storage/' . $store->logo : 'images/logo-text.png'))) }}');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            opacity: 0.09;
            z-index: 1;
            pointer-events: none;
        }
    </style>
</head>

<body>
    <div class="watermark"></div>
    <div class="container">
        <div class="header">
            <img src="{{ $store->logo ? base_path('public/storage/' . $store->logo) : base_path('public/images/logo-text.png') }}"
                alt="{{ config('app.name') }}" class="logo">
                <div class="store-info-line">
                    <div class="store-info-item">
                        <i class="fas fa-store"></i>
                        @if ($store->domain)
                            <a href="{{ $store->domain }}" target="_blank" class="store-info-value"
                                style="text-decoration: none;">{{ $store->domain }}</a>
                        @endif
                        @if ($store->email)
                            |
                            <span class="store-info-value">{{ $store->email }}</span>
                        @endif
                        @if ($store->phone)
                            |
                            <span class="store-info-value">{{ $store->phone }}</span>
                        @endif
                    </div>
                </div>
            <h1>{{ $isCustomer ? 'Order Confirmation' : 'New Order Notification' }}</h1>
        </div>

        <p class="greeting">
            @if ($isCustomer)
                Dear {{ $order->customer_name }},<br>
                Thank you for your order. We're pleased to confirm that we've received your purchase.
            @else
                A new order has been received and requires your attention.
            @endif
        </p>

        <div class="order-details d-flex">
            <div class="col-md-6">
                <h3>Customer Details</h3>
                <div class="info-row">
                    <span class="info-label">Name :</span>
                    <span class="info-value">{{ $order->name }}</span>
                </div>
                @if ($order->email)
                    <div class="info-row">
                        <span class="info-label">Email :</span>
                        <span class="info-value">{{ $order->email }}</span>
                    </div>
                @endif
                @if ($order->phone)
                    <div class="info-row">
                        <span class="info-label">Phone :</span>
                        <span class="info-value">
                            {{ $order->phone ?? 'N/A' }}
                        </span>
                    </div>
                @endif
                <div class="info-row">
                    <span class="info-label">Address :</span>
                    <span class="info-value">
                        {{ $order->address }}
                    </span>
                </div>
                <!-- More details -->
            </div>
            <div class="col-md-6-left">
                <h3>Order Details</h3>
                <div class="info-row">
                    <span class="info-label">Order No :</span>
                    <span class="info-value">#{{ $order->uuid }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Order Date :</span>
                    <span class="info-value">{{ $order->created_at->format('F j, Y') }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Status :</span>
                    <span class="info-value">{{ ucfirst($order->status) }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Payment Method :</span>
                    <span class="info-value">{{ $order->payment_method }}</span>
                </div>
                @if ($order->notes)
                <div class="info-row">
                    <span class="info-label">Notes :</span>
                    <span class="info-value">{{ $order->notes }}</span>
                </div>
                @endif
                <!-- More details -->
            </div>
        </div>

        <h2>Order Summary</h2>
        <table>
            <thead>
                <tr>
                    <th>Item Description</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($order->items as $item)
                    <tr>
                        <td>{{ $item->item }}</td>
                        <td>{{ $item->qty }}</td>
                        <td>${{ number_format($item->price, 2) }}</td>
                        <td>${{ number_format($item->price * $item->qty, 2) }}</td>
                    </tr>
                @endforeach
                <tr class="total-row">
                    <td colspan="3">Total Amount</td>
                    <td>${{ number_format($order->total, 2) }}</td>
                </tr>
            </tbody>
        </table>

        <div class="footer">
            <p>Thank you for choosing {{ $store->name }}</p>
            <div class="company-info">
                <span>© {{ now()->year }} | {{ $store->name }}</span>
                @if ($store->address)
                    |
                    <span>Address: {{ $store->address }}</span>
                @endif
            </div>
        </div>
    </div>
    <div class="page-footer">
        <p>Generated on: {{ now()->format('F d, Y H:i:s') }}</p>
        <p>Powerd By: Chologori.com</p>
    </div>
</body>

</html>
