@component('mail::message')
# Hello {{ $userName }},

You have successfully registered on {{ $storeName ?? 'Cholo Gori' }}. Please click the button below to verify your email address.

@component('mail::button', ['url' => $verificationUrl])
Verify Email Address
@endcomponent

If you did not create an account, no further action is required.

Thanks,<br>
{{ $storeName ?? 'Cholo Gori' }}

@endcomponent

