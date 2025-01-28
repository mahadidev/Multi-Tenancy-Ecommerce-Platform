<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <title>@yield('title')</title>
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
            padding-top: 10px;
        }

        .logo {
            max-width: 150px;
            /* Reduced logo size */
            /* margin-bottom: 15px; */
            /* Reduced margin */
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

        @media (max-width: 640px) {
            .store-info-line {
                flex-direction: column;
                gap: 10px;
            }
        }


        .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        .table th,
        .table td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }

        .table thead {
            background-color: #f2f2f2;
            font-weight: bold;
        }

        .table tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        .table tr:hover {
            background-color: #f5f5f5;
        }

        .report-header {
            text-align: center;
            margin-bottom: 20px;
            color: #333;
        }

        .report-metadata {
            font-size: 0.9em;
            color: #666;
            margin-bottom: 15px;
            text-align: left;
        }

        .company-info {
            margin-top: 10px;
            /* Reduced margin */
            font-size: 12px;
            /* Slightly smaller font size */
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

        @page {
            margin: 60px 20px 60px 20px;
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
            background-image: url('data:image/png;base64,{{ base64_encode(file_get_contents(public_path($store->logo ? 'storage/' . $store->logo : 'images/logo-text.png'))) }}');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            opacity: 0.09;
            z-index: 1;
            pointer-events: none;
        }
    </style>
    @yield('custom_css')
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

            <h1>@yield('title')</h1>
        </div>

        @yield('content')

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
