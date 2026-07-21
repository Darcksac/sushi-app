<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mis Pedidos - Sushi App</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #ff5722;
            --shadow-1: 0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12);
            --shadow-header: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
        }
        body { margin: 0; font-family: 'Roboto', sans-serif; background: #fafafa; color: rgba(0,0,0,0.87); }
        .navbar { background: #ff5722; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; box-shadow: var(--shadow-header); color: white; }
        .navbar h2 { margin: 0; font-size: 1.25rem; font-weight: 500; }
        .nav-links a { color: rgba(255,255,255,0.8); text-decoration: none; margin-left: 1.5rem; transition: color 0.3s; font-weight: 500; text-transform: uppercase; font-size: 0.875rem; }
        .nav-links a.active, .nav-links a:hover { color: #ffffff; }
        
        .container { max-width: 800px; margin: 3rem auto; padding: 0 2rem; }
        h1 { font-weight: 400; font-size: 2rem; margin-bottom: 0.5rem; }
        .subtitle { color: rgba(0,0,0,0.6); margin-bottom: 2.5rem; font-size: 1rem; }
        
        .order-card { background: #ffffff; border-radius: 4px; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: var(--shadow-1); }
        .order-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(0,0,0,0.12); padding-bottom: 1rem; margin-bottom: 1rem; }
        .order-header h3 { margin: 0; color: var(--primary); font-weight: 500; font-size: 1.25rem; }
        .order-date { color: rgba(0,0,0,0.6); font-size: 0.875rem; }
        
        .order-items { list-style: none; padding: 0; margin: 0 0 1rem 0; color: rgba(0,0,0,0.87); }
        .order-items li { margin-bottom: 0.5rem; display: flex; justify-content: space-between; font-size: 0.875rem; }
        
        .order-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; }
        .order-total { font-size: 1.25rem; font-weight: 500; color: rgba(0,0,0,0.87); }
        
        .badge { padding: 4px 12px; border-radius: 16px; font-size: 0.75rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }
        .badge.pendiente { background-color: #fff3e0; color: #e65100; }
        .badge.preparando { background-color: #e3f2fd; color: #1565c0; }
        .badge.entregado { background-color: #e8f5e9; color: #2e7d32; }
        .badge.cancelado { background-color: #ffebee; color: #c62828; }
        
        .alert-success { background: #e8f5e9; color: #2e7d32; padding: 1rem; border-radius: 4px; margin-bottom: 2rem; box-shadow: var(--shadow-1); }
        
        button.logout-btn { background:none; border:none; color:rgba(255,255,255,0.8); font-weight:500; font-size:0.875rem; text-transform:uppercase; cursor:pointer; font-family:inherit; margin-left: 1.5rem; transition: color 0.3s; }
        button.logout-btn:hover { color: #ffffff; }
    </style>
</head>
<body>
    <div class="navbar">
        <h2>🍣 Sushi App</h2>
        <div class="nav-links">
            <a href="{{ route('dashboard') }}">Menú</a>
            <a href="{{ route('client.history') }}" class="active">Mis Pedidos</a>
            <form method="POST" action="{{ route('logout') }}" style="display:inline;">
                @csrf
                <button type="submit" class="logout-btn">Salir</button>
            </form>
        </div>
    </div>

    <div class="container">
        <h1>Historial de Pedidos</h1>
        <p class="subtitle">Revisa el estado de tus pedidos y tus tickets anteriores.</p>

        @if(session('success'))
            <div class="alert-success">{{ session('success') }}</div>
        @endif

        @forelse($orders as $order)
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <h3>Pedido #{{ $order->id }}</h3>
                        <span class="order-date">{{ $order->created_at->format('d/m/Y H:i A') }}</span>
                    </div>
                    <span class="badge {{ strtolower($order->status) }}">{{ $order->status }}</span>
                </div>
                
                <ul class="order-items">
                    @foreach($order->items as $item)
                        <li>
                            <span>{{ $item->quantity }}x {{ $item->dish->name ?? 'Platillo Eliminado' }}</span>
                            <span>${{ number_format($item->price * $item->quantity, 2) }}</span>
                        </li>
                    @endforeach
                </ul>

                <div class="order-footer">
                    <div class="order-total">Total: ${{ number_format($order->total, 2) }}</div>
                </div>
            </div>
        @empty
            <div style="text-align:center; color:rgba(0,0,0,0.6); padding:3rem; background: #fff; border-radius:4px; box-shadow: var(--shadow-1);">Aún no has realizado ningún pedido.</div>
        @endforelse
    </div>
</body>
</html>
