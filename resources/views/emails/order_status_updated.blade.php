<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Status Update</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }

        .email-wrapper {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .email-header {
            background: #4CAF50;
            color: #ffffff;
            padding: 20px;
            text-align: center;
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

        .email-button {
            display: inline-block;
            background: #4CAF50;
            color: #fff;
            padding: 12px 20px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: bold;
        }

        .email-footer {
            text-align: center;
            padding: 10px 20px;
            font-size: 14px;
            color: #777777;
            background: #f4f4f4;
            border-top: 1px solid #ddd;
        }

        .email-footer a {
            color: #4CAF50;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-header">
            <h1>Order Status Update</h1>
        </div>
        <div class="email-body">
            <h1>Hello, {{ $order->user->name }}</h1>
            <p>Your order with the ID <strong>{{ $order->uuid }}</strong> has been updated to <strong>{{ ucfirst($order->status) }}</strong>.</p>
            <p>We appreciate your continued trust in our service and hope to serve you again soon.</p>
            <div class="email-panel">
                <p><strong>Order ID:</strong> {{ $order->uuid }}</p>
                <p><strong>Updated Status:</strong> {{ ucfirst($order->status) }}</p>
            </div>
            <a href="{{ $order->store->domain() ?? config('app.url') }}" class="email-button">Visit Our Store</a>
        </div>
        <div class="email-footer">
            <p>If you have any questions, feel free to reach out to our <a href="{{ config('app.url') }}/contact">support team</a>.</p>
            <p>Thanks and regards, <br> {{ config('app.name') }}</p>
        </div>
    </div>
</body>
</html>
