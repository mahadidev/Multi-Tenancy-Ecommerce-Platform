<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $isCustomer ? 'Order Confirmation' : 'New Order Notification' }}</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #2d3748;
            background-color: #f7fafc;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 800px;
            margin: 40px auto;
            padding: 40px;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            background-color: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            position: relative;
            overflow: hidden;
        }

        .header {
            text-align: center;
            padding-bottom: 30px;
            border-bottom: 2px solid #edf2f7;
            margin-bottom: 30px;
        }

        .logo {
            max-width: 200px;
            margin-bottom: 20px;
        }

        h1 {
            color: #1a202c;
            font-size: 28px;
            font-weight: 600;
            margin: 0;
        }

        h2 {
            color: #2d3748;
            font-size: 22px;
            font-weight: 600;
            margin: 30px 0 15px;
        }

        .order-details {
            background-color: #f8fafc;
            padding: 25px;
            border-radius: 8px;
            margin: 25px 0;
        }

        .order-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
        }

        .info-item {
            margin-bottom: 15px;
        }

        .info-label {
            font-size: 14px;
            color: #64748b;
            margin-bottom: 5px;
        }

        .info-value {
            font-size: 16px;
            font-weight: 500;
            color: #1a202c;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 25px 0;
            font-size: 15px;
        }

        table th {
            background-color: #f8fafc;
            padding: 15px;
            text-align: left;
            font-weight: 600;
            color: #475569;
            border-bottom: 2px solid #e2e8f0;
        }

        table td {
            padding: 15px;
            border-bottom: 1px solid #e2e8f0;
        }

        .total-row td {
            font-weight: 600;
            border-top: 2px solid #e2e8f0;
            background-color: #f8fafc;
        }

        .actions {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin: 40px 0;
        }

        .button {
            display: inline-block;
            padding: 12px 30px;
            /* background-color: #3182ce; */
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            transition: background-color 0.2s;
        }

        .button.primary {
            background-color: #3182ce;
        }

        .button.primary:hover {
            background-color: #2b6cb0;
        }

        .button.success {
            background-color: #38a169;
        }

        .button.success:hover {
            background-color: #2c7a4b;
        }

        .footer {
            text-align: center;
            padding-top: 30px;
            border-top: 2px solid #edf2f7;
            color: #718096;
            font-size: 14px;
        }

        .company-info {
            margin-top: 20px;
            font-size: 13px;
        }

        @media print {
            body {
                background-color: #ffffff;
            }

            .container {
                box-shadow: none;
                margin: 0;
                padding: 20px;
            }

            .button {
                display: none;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <img src="https://app.chologori.com/images/logos/logo-black.png" alt="{{ config('app.url') }}"  class="logo">
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
                        <td>{{ number_format($item->price, 2) }}</td>
                        <td>{{ number_format($item->price * $item->qty, 2) }}</td>
                    </tr>
                @endforeach
                <tr class="total-row">
                    <td colspan="3">Total Amount</td>
                    <td>{{ number_format($order->total, 2) }}</td>
                </tr>
            </tbody>
        </table>

        <div class="actions">
            <a href="{{ url('/api/v1/orders/index') }}" class="button primary">
                {{ $isCustomer ? 'View Order Details' : 'Process Order' }}
            </a>
            &nbsp;
            &nbsp;
            <a href="{{ route('order.download', ['uuid' => $order->uuid, 'isCustomer' => $isCustomer ? '1' : '0']) }}" class="button success">
                Download Invoice
            </a>
        </div>

        <div class="footer">
            <p>Thank you for choosing {{ config('app.name') }}!</p>
            <div class="company-info">
                {{ config('app.name') }}
            </div>
        </div>
    </div>
</body>

</html>
