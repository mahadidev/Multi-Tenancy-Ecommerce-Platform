<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="base-url" content="{{ env('APP_URL') }}">
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
    @vite(['resources/js/frontend/index.tsx'])
</head>

<body>
    <div id="root"></div>
</body>

</html>
