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
            margin: 20px 0 10px;
            /* Reduced margins */
        }

        .order-details {
            background-color: #f8fafc;
            padding: 15px;
            /* Reduced padding */
            border-radius: 6px;
            /* Smaller border radius */
            margin: 15px 0;
            /* Reduced margin */
        }

        .order-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            /* Adjusted column size */
            gap: 10px;
            /* Reduced gap */
        }

        .info-item {
            margin-bottom: 10px;
            /* Reduced margin */
        }

        .info-label {
            font-size: 13px;
            /* Slightly smaller font size */
            color: #64748b;
            margin-bottom: 3px;
            /* Reduced margin */
        }

        .info-value {
            font-size: 14px;
            /* Slightly smaller font size */
            font-weight: 500;
            color: #1a202c;
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
        .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            width: 100%;
            height: 120%;
            background-image: url('data:image/png;base64,{{ base64_encode(file_get_contents(public_path('images/logos/logo-black.png'))) }}');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            opacity: 0.1;
            z-index: 1;
            pointer-events: none;
        }
    </style>
</head>

<body>
    <div class="watermark"></div>
    <div class="container">
        <div class="header">
            <img src="{{ base_path('public/images/logos/logo-black.png') }}" alt="{{ config('app.name') }}"
                class="logo">
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

        <div class="order-details">
            <div class="order-info">
                <div class="info-item">
                    <div class="info-label">Order Number</div>
                    <div class="info-value">#{{ $order->uuid }}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Order Date</div>
                    <div class="info-value">{{ $order->created_at->format('F j, Y') }}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Status</div>
                    <div class="info-value">{{ ucfirst($order->status) }}</div>
                </div>
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
            <p>Thank you for choosing {{ config('app.name') }}!</p>
            <div class="company-info">
                {{ config('app.name') }}
            </div>
        </div>
    </div>
</body>

</html>
