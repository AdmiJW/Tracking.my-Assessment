<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">


<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Laravel Todo</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,600&display=swap" rel="stylesheet" />

    <!-- Styles -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css">
</head>


<body class="antialiased">

    <!-- Navbar -->
    <nav class="navbar navbar-light bg-dark">
        <div class="d-flex container">
            <a class="navbar-brand d-flex gap-3 align-items-center text-white" href="#">
                <img src="https://laravel.com/img/logomark.min.svg" alt="" width="30" height="24" class="d-inline-block align-text-top">
                Laravel Todo
            </a>

            <div class='grow'></div>

            @if (Route::has('login'))
                <div class='d-flex align-items-center gap-2'>
                    @auth
                        <a href="{{ url('/dashboard') }}" class="btn btn-outline-light">Dashboard</a>
                    @else
                        <a href="{{ route('login') }}" class="btn btn-outline-light">Log in</a>
    
                        @if (Route::has('register'))
                            <a href="{{ route('register') }}" class="btn btn-outline-light">Register</a>
                        @endif
                    @endauth
                </div>
            @endif
        </div>
    </nav>

    <!-- Hero section -->
    <div class="jumbotron jumbotron-fluid p-5">
        <div class="container text-center">
            <img src="https://laravel.com/img/logomark.min.svg" alt="" width="100" height="80" class="mb-4">
            <h1 class="display-4">Welcome to the Laravel Todo App</h1>
            <p class="lead">Keep track of your daily tasks and stay organized.</p>

            <a href="{{ route('login') }}" class="btn btn-outline-primary">Log in</a>
    
            @if (Route::has('register'))
                <a href="{{ route('register') }}" class="btn btn-outline-primary">Register</a>
            @endif


            <p class='mt-5 text-muted fw-light'>
                Tracking.my Assessment Project. Created by AdmiJW with Laravel and breeze.
            </p>
        </div>
    </div>
</body>
</html>
