<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body class="font-sans text-gray-900 antialiased">
        <div class="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
            <div>
                <a href="/">
                    <x-application-logo class="w-20 h-20 fill-current text-gray-500" />
                </a>
            </div>

            <div class="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                {{ $slot }}
            </div>
        </div>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap');
            body { background-color: #fafafa !important; color: rgba(0,0,0,0.87) !important; font-family: 'Roboto', sans-serif !important; }
            .bg-gray-100 { background-color: #fafafa !important; }
            .bg-white { 
                background-color: #ffffff !important; 
                border: none !important;
                border-radius: 4px !important;
                box-shadow: 0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12) !important;
            }
            label { color: rgba(0,0,0,0.6) !important; font-weight: 400 !important; font-size: 0.875rem !important; }
            input[type="email"], input[type="password"] { 
                background-color: #ffffff !important; 
                color: rgba(0,0,0,0.87) !important; 
                border: 1px solid rgba(0,0,0,0.38) !important;
                border-radius: 4px !important;
                padding: 10px !important;
                box-shadow: none !important;
            }
            input[type="email"]:focus, input[type="password"]:focus {
                border-color: #ff5722 !important;
                border-width: 2px !important;
                outline: none !important;
            }
            button, .bg-gray-800 { 
                background-color: #ff5722 !important; 
                color: #ffffff !important; 
                font-weight: 500 !important; 
                text-transform: uppercase !important;
                border-radius: 4px !important;
                box-shadow: 0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12) !important;
                letter-spacing: 0.5px !important;
                transition: background 0.3s !important;
            }
            button:hover, .bg-gray-800:hover { 
                background-color: #e64a19 !important; 
            }
            a { color: #ff5722 !important; }
            span.text-gray-600 { color: rgba(0,0,0,0.6) !important; }
            .text-gray-900 { color: rgba(0,0,0,0.87) !important; }
            .text-gray-500 { color: #ff5722 !important; }
        </style>
    </body>
</html>
