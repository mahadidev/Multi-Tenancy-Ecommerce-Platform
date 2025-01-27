@component('mail::message')
# Hello, {{ $userName }}

You requested to reset your password. Click the button below to reset it:

@component('mail::button', ['url' => $resetUrl])
Reset Password
@endcomponent

If you did not request this, no further action is required.

Thanks,  
{{ config('app.name') }}
@endcomponent
