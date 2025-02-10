<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Status Update</title>
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
            font-size: 20px;
            font-weight: 600;
            text-align: center !important;
            padding-left: 30%;
            padding-right: 30%;
            padding-top: 50px;
        }

        .store-info-value {
            color: #1e293b !important;
        }

        .email-body {
            padding: 20px;
        }

        .email-body h1 {
            font-size: 22px;
            margin-bottom: 15px;
            color: #333333;
        }

        .email-body p {
            margin: 15px 0;
            color: #555555;
        }

        .email-panel {
            background: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            font-size: 16px;
        }

        .email-panel strong {
            color: #333333;
        }

        /* New status colors */
        .status {
            font-weight: bold;
            padding: 4px 8px;
            border-radius: 4px;
        }

        .status-pending {
            color: #B45309;
            /* Amber/Orange */
        }

        .status-shipping {
            color: #2563EB;
            /* Blue */
        }

        .status-confirmed {
            color: #059669;
            /* Green */
        }

        .status-canceled {
            color: #DC2626;
            /* Red */
        }

        .status-processing {
            color: #6366F1;
            /* Indigo */
        }

        .status-refunded {
            color: #7C3AED;
            /* Purple */
        }

        .status-delivered {
            color: #059669;
            /* Green */
        }

        .status-failed {
            color: #DC2626;
            /* Red */
        }

        .status-returned {
            color: #9D174D;
            /* Pink */
        }

        .status-completed {
            color: #059669;
            /* Green */
        }

        .email-button {
            display: inline-block;
            background: #4CAF50;
            color: #fff !important;
            padding: 12px 20px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: bold;
        }

        .email-button:visited {
            color: #fff !important;
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
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            @if (isset($logoUrl))
                <img src="{{ $logoUrl }}" alt="{{ $store->name }}" class="logo">
            @else
                <h2 style="margin-bottom: 20px;">{{ $store->name }}</h2>
            @endif

            <div class="store-info-line">
                <div class="store-info-item">
                    @if ($store->computed_domain)
                        <a href="{{ $store->computed_domain }}" target="_blank" class="store-info-value"
                            style="text-decoration: none;">{{ $store->computed_domain }}</a>
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

            <h1>@yield('title')</h1>
        </div>

        <div class="email-body">
            <h1>Hello, {{ $order->user->name }}</h1>
            <p>Your order with the ID <strong>{{ $order->uuid }}</strong> has been updated to
                <strong>{{ ucfirst($order->status) }}</strong>.
            </p>
            <p>We appreciate your continued trust in our service and hope to serve you again soon.</p>
            <div class="email-panel">
                <p><strong>Order ID:</strong> {{ $order->uuid }}</p>
                <p><strong>Updated Status:</strong> <span
                        class="status status-{{ $order->status }}">{{ ucfirst($order->status) }}</span></p>
            </div>
            <a href="{{ $order->store->domain() ?? config('app.url') }}" class="email-button">Visit Our Store</a>
        </div>

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
</body>

</html>
