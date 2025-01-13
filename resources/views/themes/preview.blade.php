<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="base-url" content="{{ env('APP_URL') }}">
    <title>{{ env('APP_NAME') }}</title>

    @viteReactRefresh
    @vite(['resources/js/themes/index.tsx'])
</head>

<body>
    <div id="{{ $slug }}"></div>
</body>

</html>
