<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="base-url" content="{{ env('APP_URL') }}">
    <meta name="app-name" content="{{ env('APP_NAME') }}">
    <title>{{ env('APP_NAME') }}</title>

    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet"
        type="text/css" />


    @viteReactRefresh
    @vite(['resources/js/seller/index.tsx'])
</head>


<body class="bg-gray-50 dark:bg-gray-800 antialiased">

    <div id="root"></div>
</body>

</html>
