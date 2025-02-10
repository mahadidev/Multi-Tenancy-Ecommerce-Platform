<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="base-url" content="{{ env('APP_URL') }}">
    <meta name="site-slug" content="{{$slug}}">
    <title>{{ env('APP_NAME') }}</title>
    <link rel="icon" type="image/x-icon" href="{{ asset('images/logo-icon.png') }}">

    @viteReactRefresh
    @vite(['resources/js/site/index.tsx'])
</head>

<body>
    <div id="root"></div>
</body>
</html>
