<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to {{ $store->name }}</title>
</head>

<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
            <td align="center">
                <table cellpadding="0" cellspacing="0" border="0" width="800"
                    style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin: 0 auto;">
                    <!-- Header Section -->
                    <tr>
                        <td
                            style="padding: 40px 20px; background-color: #f8f9fa; border-top-left-radius: 8px; border-top-right-radius: 8px; text-align: center;">
                            @if (isset($logoUrl))
                                <img src="{{ $logoUrl }}" alt="{{ $store->name }}"
                                    style="max-width: 200px; height: auto; margin-bottom: 20px;">
                            @else
                                <h2 style="color: #333333; font-size: 24px; margin: 0 0 20px 0;">{{ $store->name }}
                                </h2>
                            @endif
                            <h1 style="color: #4CAF50; font-size: 36px; margin: 0; font-weight: bold;">Welcome to
                                {{ $store->name }}!</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px;">
                            <p style="color: #666666; font-size: 16px; line-height: 1.6;">
                                Dear {{ $user->name }},<br><br>
                                Welcome to <strong>{{ $store->name }}</strong>! We’re excited to have you on board. You
                                can now explore our store, browse products, and enjoy a seamless shopping experience.
                                <br><br>
                                If you have any questions, feel free to reach out to our support team. Happy shopping!
                            </p>

                            <!-- User Credentials Section -->
                            <table cellpadding="0" cellspacing="0" border="0" width="100%"
                                style="margin-top: 20px; background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
                                <tr>
                                    <td style="font-size: 18px; color: #333;">
                                        <strong>Your Login Credentials:</strong>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="font-size: 16px; color: #666; padding-top: 10px;">
                                        <strong>Email:</strong> {{ $user->email }} <br>
                                        @if ($password != true)
                                            <strong>Password:</strong> 123 (default)
                                        @else
                                            <strong>Password:</strong> Use the password which is set for others account.
                                        @endif
                                    </td>
                                </tr>
                                @if ($password != true)
                                    <tr>
                                        <td style="padding-top: 10px; font-size: 14px; color: #ff0000;">
                                            <em>Note: Please change your password after logging in for security
                                                reasons.</em>
                                        </td>
                                    </tr>
                                @endif
                            </table>

                            <!-- Statistics Grid -->
                            <table cellpadding="0" cellspacing="0" border="0" width="100%"
                                style="margin: 30px 0;">
                                <tr>
                                    <td width="33%"
                                        style="text-align: center; padding: 15px; background-color: #f8f9fa; border-radius: 4px;">
                                        <h4 style="color: #4CAF50; margin: 0 0 5px 0;">24/7</h4>
                                        <p style="color: #666666; margin: 0;">Support</p>
                                    </td>
                                    <td width="1%"></td>
                                    <td width="33%"
                                        style="text-align: center; padding: 15px; background-color: #f8f9fa; border-radius: 4px;">
                                        <h4 style="color: #4CAF50; margin: 0 0 5px 0;">100%</h4>
                                        <p style="color: #666666; margin: 0;">Secure</p>
                                    </td>
                                    <td width="1%"></td>
                                    <td width="33%"
                                        style="text-align: center; padding: 15px; background-color: #f8f9fa; border-radius: 4px;">
                                        <h4 style="color: #4CAF50; margin: 0 0 5px 0;">Fast</h4>
                                        <p style="color: #666666; margin: 0;">Setup</p>
                                    </td>
                                </tr>
                            </table>

                            <p style="color: #333333; font-size: 18px; text-align: center; margin: 30px 0 20px 0;">Ready
                                to start your success story? Access your dashboard now!</p>
                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <a href="{{ $domain }}"
                                            style="display: inline-block; padding: 15px 30px; background-color: #4CAF50; color: #ffffff; text-decoration: none; border-radius: 50px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Launch
                                            Dashboard</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px; background-color: #f8f9fa; text-align: center;">
                            <p style="color: #666666; margin: 0;">© {{ date('Y') }} {{ $store->name }}. All rights
                                reserved.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>
