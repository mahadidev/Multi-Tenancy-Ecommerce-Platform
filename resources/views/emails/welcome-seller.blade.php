<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Cholo Gori</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
    <!-- Main Container -->
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
            <td align="center">
                <!-- Content Container -->
                <table cellpadding="0" cellspacing="0" border="0" width="800" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin: 0 auto;">
                    <!-- Header Section -->
                    <tr>
                        <td style="padding: 40px 20px; background-color: #f8f9fa; border-top-left-radius: 8px; border-top-right-radius: 8px; text-align: center;">
                            @if (isset($logoUrl))
                                <img src="{{ $logoUrl }}" alt="{{ $store->name }}" style="max-width: 200px; height: auto; margin-bottom: 20px;">
                            @else
                                <h2 style="color: #333333; font-size: 24px; margin: 0 0 20px 0;">{{ $store->name }}</h2>
                            @endif
                            <h1 style="color: #4CAF50; font-size: 36px; margin: 0; font-weight: bold;">Welcome to Cholo Gori!</h1>
                        </td>
                    </tr>

                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <!-- Congratulations Message -->
                            <h2 style="color: #333333; margin: 0 0 20px 0;">Congratulations, <span style="color: #4CAF50;">{{ $store->owner->name ?? '' }}</span>! 🎉</h2>
                            <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Your store <strong>{{ $store->name ?? '' }}</strong> is now ready to rock the e-commerce world! We're thrilled to have you join the Chologori family.</p>

                            <!-- Store Details Card -->
                            <div style="background-color: #f8f9fa; border-left: 4px solid #4CAF50; padding: 20px; margin: 30px 0; border-radius: 4px;">
                                <h3 style="color: #333333; margin: 0 0 15px 0;">🏪 Your Store Details</h3>
                                <p style="color: #666666; margin: 5px 0;">🔗 Store URL: <strong>{{ $store->domain() ?? '' }}</strong></p>
                                <p style="color: #666666; margin: 5px 0;">🎨 Theme: <strong>{{ $store->theme->name ?? 'Custom Theme' }}</strong></p>
                            </div>

                            <!-- Statistics Grid -->
                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 30px 0;">
                                <tr>
                                    <td width="33%" style="text-align: center; padding: 15px; background-color: #f8f9fa; border-radius: 4px;">
                                        <h4 style="color: #4CAF50; margin: 0 0 5px 0;">24/7</h4>
                                        <p style="color: #666666; margin: 0;">Support</p>
                                    </td>
                                    <td width="1%"></td>
                                    <td width="33%" style="text-align: center; padding: 15px; background-color: #f8f9fa; border-radius: 4px;">
                                        <h4 style="color: #4CAF50; margin: 0 0 5px 0;">100%</h4>
                                        <p style="color: #666666; margin: 0;">Secure</p>
                                    </td>
                                    <td width="1%"></td>
                                    <td width="33%" style="text-align: center; padding: 15px; background-color: #f8f9fa; border-radius: 4px;">
                                        <h4 style="color: #4CAF50; margin: 0 0 5px 0;">Fast</h4>
                                        <p style="color: #666666; margin: 0;">Setup</p>
                                    </td>
                                </tr>
                            </table>                            

                            <!-- CTA Section -->
                            <p style="color: #333333; font-size: 18px; text-align: center; margin: 30px 0 20px 0;">Ready to start your success story? Access your dashboard now!</p>
                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <a href="{{ $domain }}" style="display: inline-block; padding: 15px 30px; background-color: #4CAF50; color: #ffffff; text-decoration: none; border-radius: 50px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Launch Dashboard</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px; background-color: #f8f9fa; border-top: 1px solid #eeeeee; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; text-align: center;">
                            <p style="color: #666666; margin: 0 0 20px 0;">💫 Your success is our priority! Need help? Our support team is available 24/7.</p>
                            {{-- <div style="margin: 20px 0;">
                                <a href="#" style="color: #4CAF50; text-decoration: none; margin: 0 10px;">📘 Facebook</a>
                                <a href="#" style="color: #4CAF50; text-decoration: none; margin: 0 10px;">📸 Instagram</a>
                                <a href="#" style="color: #4CAF50; text-decoration: none; margin: 0 10px;">🐦 Twitter</a>
                            </div> --}}
                            <p style="color: #999999; font-size: 14px; margin: 20px 0 0 0;">© {{ date('Y') }} Chologori. All rights reserved.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>