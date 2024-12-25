{{-- <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Select Store</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f4f4f9;
            font-family: Arial, sans-serif;
        }

        .container {
            background: #ffffff;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            width: 400px;
            padding: 20px 30px;
            text-align: center;
        }

        .container h1 {
            margin-bottom: 20px;
            font-size: 24px;
            color: #333333;
        }

        .radio-group {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .radio-option {
            background: #f9f9fc;
            border: 1px solid #dddddd;
            border-radius: 5px;
            padding: 10px 15px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            transition: 0.3s;
            cursor: pointer;
        }

        .radio-option:hover {
            background: #f0f4ff;
            border-color: #007bff;
        }

        .radio-option input[type="radio"] {
            display: none;
        }

        .radio-option label {
            font-size: 16px;
            color: #555555;
            margin-left: 10px;
            flex-grow: 1;
            text-align: left;
        }

        .radio-option input[type="radio"]:checked+label {
            font-weight: bold;
            color: #007bff;
        }

        .btn-submit {
            background: #007bff;
            color: #ffffff;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            margin-top: 20px;
            width: 100%;
            transition: background 0.3s;
        }

        .btn-submit:hover {
            background: #0056b3;
        }

        a {
            text-decoration: none;
        }

        a.add-store {
            display: inline-block;
            background-color: #007bff;
            /* Blue background */
            color: #ffffff;
            /* White text */
            padding: 10px 20px;
            /* Padding around the link */
            border-radius: 5px;
            /* Rounded corners */
            font-size: 16px;
            /* Text size */
            font-weight: bold;
            /* Bold text */
            transition: background-color 0.3s, box-shadow 0.3s;
            /* Smooth hover effect */
        }

        a.add-store:hover {
            background-color: #0056b3;
            /* Darker blue on hover */
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            /* Subtle shadow on hover */
        }
    </style>
</head>

<body>
    <div class="container">
        <h1>Select Your Store</h1>
        @if ($user->stores->isEmpty())
            <div class="warning">
                <p>No stores are registered under your account. Please register a store before proceeding.</p>

                <a href="/seller/stores/create" class="add-store">
                    Add Store
                </a </div>
            @else
                <form action="/select-store" method="POST">
                    @csrf <!-- Ensure CSRF protection -->
                    <div class="radio-group">
                        @foreach ($user->stores as $store)
                            <div class="radio-option">
                                <input type="radio" id="store{{ $store->id }}" name="store"
                                    value="{{ $store->id }}">
                                <label for="store{{ $store->id }}">{{ $store->name }}</label>
                            </div>
                        @endforeach
                    </div>
                    <button type="submit" class="btn-submit">Continue</button>
                </form>
        @endif
    </div>

</body>

</html> --}}

{{-- 

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Select Store</title>
    <style>
        /* General body styling */
        body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: linear-gradient(135deg, #4a90e2, #9013fe);
            font-family: 'Roboto', sans-serif;
            color: #333;
        }

        /* Container styling */
        .container {
            background: #ffffff;
            border-radius: 15px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
            width: 450px;
            padding: 30px;
            text-align: center;
            animation: fadeIn 1s ease-in-out;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Header styling */
        .container h1 {
            margin-bottom: 20px;
            font-size: 26px;
            color: #333333;
            font-weight: bold;
        }

        /* Radio group styling */
        .radio-group {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .radio-option {
            background: #f8f9fd;
            border: 2px solid #e5e7f3;
            border-radius: 10px;
            padding: 15px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            transition: all 0.3s ease;
            cursor: pointer;
        }

        .radio-option:hover {
            background: #f0f5ff;
            border-color: #4a90e2;
        }

        .radio-option input[type="radio"] {
            display: none;
        }

        .radio-option label {
            font-size: 16px;
            color: #555555;
            margin-left: 10px;
            font-weight: 500;
        }

        .radio-option input[type="radio"]:checked+label {
            font-weight: bold;
            color: #4a90e2;
        }

        /* Button styling */
        .btn-submit {
            background: linear-gradient(135deg, #4a90e2, #9013fe);
            color: #ffffff;
            border: none;
            padding: 12px 20px;
            border-radius: 50px;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            margin-top: 20px;
            width: 100%;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(144, 19, 254, 0.4);
        }

        .btn-submit:hover {
            background: linear-gradient(135deg, #3a7bcf, #7210d4);
            box-shadow: 0 6px 20px rgba(144, 19, 254, 0.6);
        }

        /* Add store link */
        a.add-store {
            display: inline-block;
            margin-top: 15px;
            text-decoration: none;
            color: #4a90e2;
            font-weight: bold;
            font-size: 16px;
            transition: color 0.3s ease;
        }

        a.add-store:hover {
            color: #9013fe;
            text-decoration: underline;
        }

        /* Warning box */
        .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeeba;
            color: #856404;
            border-radius: 10px;
            padding: 15px;
            font-size: 16px;
            margin-top: 10px;
        }
    </style>
</head>

<body>
    <div class="container">
        <h1>Select Your Store</h1>
        @if ($user->stores->isEmpty())
            <div class="warning">
                <p>No stores are registered under your account. Please register a store before proceeding.</p>
                <a href="/seller/stores/create" class="add-store">Add Store</a>
            </div>
        @else
            <form action="/select-store" method="POST">
                @csrf <!-- Ensure CSRF protection -->
                <div class="radio-group">
                    @foreach ($user->stores as $store)
                        <div class="radio-option">
                            <input type="radio" id="store{{ $store->id }}" name="store" value="{{ $store->id }}">
                            <label for="store{{ $store->id }}">{{ $store->name }}</label>
                        </div>
                    @endforeach
                </div>
                <button type="submit" class="btn-submit">Continue</button>
            </form>
        @endif
    </div>
</body>

</html> --}}



<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Select Store</title>
    <style>
        /* General body styling */
        body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: linear-gradient(135deg, #4a90e2, #9013fe);
            font-family: 'Roboto', sans-serif;
            color: #333;
        }

        /* Container styling */
        .container {
            background: #ffffff;
            border-radius: 15px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
            width: 450px;
            padding: 30px;
            text-align: center;
            animation: fadeIn 1s ease-in-out;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Header styling */
        .container h1 {
            margin-bottom: 20px;
            font-size: 26px;
            color: #333333;
            font-weight: bold;
        }

        /* Radio group styling */
        .radio-group {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .radio-option {
            position: relative;
            background: #f8f9fd;
            border: 2px solid #e5e7f3;
            border-radius: 10px;
            padding: 15px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            transition: all 0.3s ease;
            cursor: pointer;
        }

        .radio-option:hover {
            background: #f0f5ff;
            border-color: #4a90e2;
        }

        .radio-option input[type="radio"] {
            display: none;
        }

        .radio-option label {
            font-size: 16px;
            color: #555555;
            margin-left: 15px;
            font-weight: 500;
            flex: 1;
            text-align: left;
        }

        .radio-option input[type="radio"]:checked+label {
            font-weight: bold;
            color: #4a90e2;
        }

        /* Radio indicator */
        .radio-indicator {
            width: 20px;
            height: 20px;
            border: 2px solid #e5e7f3;
            border-radius: 50%;
            position: relative;
            transition: all 0.3s ease;
        }

        .radio-option:hover .radio-indicator {
            border-color: #4a90e2;
        }

        .radio-indicator::after {
            content: "";
            position: absolute;
            top: 50%;
            left: 50%;
            width: 12px;
            height: 12px;
            background: transparent;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            transition: all 0.3s ease;
        }

        input[type="radio"]:checked~.radio-indicator {
            border-color: #4a90e2;
            background-color: #4a90e2;
        }

        input[type="radio"]:checked~.radio-indicator::after {
            background: #ffffff;
        }

        /* Button styling */
        .btn-submit {
            background: linear-gradient(135deg, #4a90e2, #9013fe);
            color: #ffffff;
            border: none;
            padding: 12px 20px;
            border-radius: 50px;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            margin-top: 20px;
            width: 100%;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(144, 19, 254, 0.4);
        }

        .btn-submit:hover {
            background: linear-gradient(135deg, #3a7bcf, #7210d4);
            box-shadow: 0 6px 20px rgba(144, 19, 254, 0.6);
        }

        /* Add store link */
        a.add-store {
            display: inline-block;
            margin-top: 15px;
            text-decoration: none;
            color: #4a90e2;
            font-weight: bold;
            font-size: 16px;
            transition: color 0.3s ease;
        }

        a.add-store:hover {
            color: #9013fe;
            text-decoration: underline;
        }

        /* Warning box */
        .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeeba;
            color: #856404;
            border-radius: 10px;
            padding: 15px;
            font-size: 16px;
            margin-top: 10px;
        }
    </style>
</head>

<body>
    <div class="container">
        <h1>Select Your Store</h1>
        @if ($user->stores->isEmpty())
            <div class="warning">
                <p>No stores are registered under your account. Please register a store before proceeding.</p>
                <a href="/seller/stores/create" class="add-store">Add Store</a>
            </div>
        @else
            <form action="{{route('seller.store.switch')}}" method="POST">
                @csrf 
                <div class="radio-group">
                    @foreach ($user->stores as $store)
                        <div class="radio-option">
                            <input type="radio" id="store{{ $store->id }}" name="store" value="{{ $store->id }}">
                            <span class="radio-indicator" for="store{{ $store->id }}"></span>
                            <label for="store{{ $store->id }}">{{ $store->name }}</label>
                        </div>
                    @endforeach
                </div>
                <button type="submit" class="btn-submit">Continue</button>
            </form>
        @endif
    </div>
</body>

</html>
