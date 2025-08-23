<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="base-url" content="{{ env('APP_URL') }}">
    <meta name="app-name" content="{{ env('APP_NAME') }}">
    <meta name="website-renderer-url" content="{{ config('services.website_renderer.url') }}">
    <title>{{ env('APP_NAME') }}</title>
    <link rel="icon" type="image/x-icon" href="{{ asset('images/logo-icon.png') }}">

    <style>
        @font-face {
            font-family: ibrand;
            src: url("{{ asset('fonts/ibrand/Ibrand.otf') }}");
            font-weight: bold;
        }

        @font-face {
            font-family: myriad;
            src: url("{{ asset('fonts/myriad/MYRIADPRO-REGULAR.OTF') }}");
        }

        @font-face {
            font-family: myriad;
            src: url("{{ asset('fonts/myriad/MYRIADPRO-SEMIBOLD.OTF') }}");
            font-weight: medium;
        }

        @font-face {
            font-family: myriad;
            src: url("{{ asset('fonts/myriad/MYRIADPRO-BOLD.OTF') }}");
            font-weight: bold;
        }
    </style>

    @viteReactRefresh
    {{-- @vite(['resources/js/themes/index.tsx', 'resources/js/seller/index.tsx']) --}}
    @vite(['resources/js/seller/index.tsx'])
</head>


<body class=" bg-gray-50 dark:bg-gray-900 antialiased ">

    <div id="root"></div>
</body>

</html>
