<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Menú - Sushi App</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #ff5722;
            --primary-hover: #e64a19;
            --shadow-1: 0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12);
            --shadow-2: 0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12);
            --shadow-header: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
        }
        body { margin: 0; font-family: 'Roboto', sans-serif; background: #fafafa; color: rgba(0,0,0,0.87); }
        .navbar { background: #ff5722; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; box-shadow: var(--shadow-header); color: white; }
        .navbar h2 { margin: 0; font-size: 1.25rem; font-weight: 500; }
        .nav-links a { color: rgba(255,255,255,0.8); text-decoration: none; margin-left: 1.5rem; transition: color 0.3s; font-weight: 500; text-transform: uppercase; font-size: 0.875rem; }
        .nav-links a.active, .nav-links a:hover { color: #ffffff; }
        
        .container { max-width: 1000px; margin: 3rem auto; padding: 0 2rem; }
        h1 { font-weight: 400; font-size: 2rem; margin-bottom: 0.5rem; }
        .subtitle { color: rgba(0,0,0,0.6); margin-bottom: 2.5rem; font-size: 1rem; }
        
        .dish-card { background: #ffffff; border-radius: 4px; overflow: hidden; display: flex; align-items: center; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: var(--shadow-1); transition: box-shadow 0.3s; }
        .dish-card:hover { box-shadow: var(--shadow-2); }
        .dish-info { flex: 1; }
        .dish-info h3 { margin: 0 0 0.5rem 0; font-size: 1.25rem; font-weight: 500; }
        .dish-info p { margin: 0 0 1rem 0; color: rgba(0,0,0,0.6); font-size: 0.875rem; }
        .dish-price { font-weight: 500; color: var(--primary); font-size: 1.25rem; }
        
        .dish-actions { display: flex; align-items: center; gap: 1rem; }
        .quantity-input { width: 60px; padding: 0.5rem; border: 1px solid rgba(0,0,0,0.38); border-radius: 4px; text-align: center; font-size: 1rem; color: rgba(0,0,0,0.87); }
        .quantity-input:focus { outline: none; border-color: var(--primary); border-width: 2px; }
        
        .btn-primary { background: var(--primary); color: white; border: none; padding: 0 16px; height: 45px; line-height: 45px; border-radius: 4px; font-weight: 500; font-size: 0.875rem; text-transform: uppercase; cursor: pointer; width: 100%; transition: background 0.3s, box-shadow 0.3s; margin-top: 2rem; box-shadow: var(--shadow-1); letter-spacing: 0.5px; }
        .btn-primary:hover { background: var(--primary-hover); box-shadow: var(--shadow-2); }
        
        .alert-error { background: #ffebee; color: #c62828; padding: 1rem; border-radius: 4px; margin-bottom: 2rem; box-shadow: var(--shadow-1); }
        
        button.logout-btn { background:none; border:none; color:rgba(255,255,255,0.8); font-weight:500; font-size:0.875rem; text-transform:uppercase; cursor:pointer; font-family:inherit; margin-left: 1.5rem; transition: color 0.3s; }
        button.logout-btn:hover { color: #ffffff; }
    </style>
</head>
<body>
    <div class="navbar">
        <h2>🍣 Sushi App</h2>
        <div class="nav-links">
            <a href="{{ route('dashboard') }}" class="active">Menú</a>
            <a href="{{ route('client.history') }}">Mis Pedidos</a>
            <form method="POST" action="{{ route('logout') }}" style="display:inline;">
                @csrf
                <button type="submit" class="logout-btn">Salir</button>
            </form>
        </div>
    </div>

    <div class="container">
        <h1>Nuestro Menú</h1>
        <p class="subtitle">Elige tus platillos favoritos y realiza tu pedido.</p>

        @if(session('error'))
            <div class="alert-error">{{ session('error') }}</div>
        @endif

        <form action="{{ route('client.checkout') }}" method="POST">
            @csrf
            @forelse($dishes as $dish)
                <div class="dish-card">
                    <div class="dish-info">
                        <h3>{{ $dish->name }}</h3>
                        <p>{{ $dish->description }}</p>
                        <div class="dish-price">${{ number_format($dish->price, 2) }}</div>
                    </div>
                    <div class="dish-actions">
                        <input type="hidden" name="dish_id[]" value="{{ $dish->id }}">
                        <label style="color:rgba(0,0,0,0.6); font-size:0.875rem;">Cantidad:</label>
                        <input type="number" name="quantity[]" value="0" min="0" class="quantity-input">
                    </div>
                </div>
            @empty
                <div style="text-align:center; color:rgba(0,0,0,0.6); padding:3rem; background: #fff; border-radius: 4px; box-shadow: var(--shadow-1);">No hay platillos disponibles en este momento.</div>
            @endforelse

            @if(count($dishes) > 0)
                <button type="submit" class="btn-primary">Confirmar Pedido</button>
            @endif
        </form>
    </div>
</body>
</html>
