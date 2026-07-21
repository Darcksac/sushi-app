<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Sushi App</title>
    <link rel="stylesheet" href="{{ asset('css/admin.css') }}">
</head>
<body>
    <div class="sidebar">
        <h2>🍣 Sushi Admin</h2>
        <ul class="nav-links">
            <li>
                <a href="{{ route('admin.dashboard') }}" class="{{ request()->routeIs('admin.dashboard') ? 'active' : '' }}">
                    Dashboard
                </a>
            </li>
            <li>
                <a href="{{ route('admin.dishes.index') }}" class="{{ request()->routeIs('admin.dishes.*') ? 'active' : '' }}">
                    Platillos
                </a>
            </li>
            <li>
                <a href="{{ route('admin.orders.index') }}" class="{{ request()->routeIs('admin.orders.*') ? 'active' : '' }}">
                    Pedidos
                </a>
            </li>
            @if(auth()->check() && auth()->user()->role === 'admin')
            <li>
                <a href="{{ route('admin.users.index') }}" class="{{ request()->routeIs('admin.users.*') ? 'active' : '' }}">
                    Usuarios
                </a>
            </li>
            @endif
            <li style="margin-top: 2rem;">
                <form method="POST" action="{{ route('logout') }}">
                    @csrf
                    <button type="submit">🚪 Cerrar Sesión</button>
                </form>
            </li>
        </ul>
    </div>
    
    <div class="main-content">
        @if(session('success'))
            <div style="background: #bbf7d0; color: #166534; padding: 1rem; border-radius: 8px; margin-bottom: 2rem;">
                {{ session('success') }}
            </div>
        @endif
        @if(session('error'))
            <div style="background: #fecaca; color: #991b1b; padding: 1rem; border-radius: 8px; margin-bottom: 2rem;">
                {{ session('error') }}
            </div>
        @endif

        @yield('content')
    </div>
</body>
</html>
