@extends('layouts.admin')

@section('content')
<div class="header">
    <div>
        <h1>Bienvenido, {{ auth()->user()->name }}</h1>
        <p style="color: #666; margin-top: 0.5rem;">Resumen de tu negocio de sushi de un vistazo.</p>
    </div>
</div>

<div class="stats-grid">
    <div class="stat-card">
        <h3>Ganancias del Día</h3>
        <div class="value text-orange">${{ number_format($todayEarnings, 2) }}</div>
    </div>
    <div class="stat-card">
        <h3>Ganancias de la Semana</h3>
        <div class="value">${{ number_format($weekEarnings, 2) }}</div>
    </div>
    <div class="stat-card">
        <h3>Pedidos Pendientes</h3>
        <div class="value">{{ $pendingOrders }}</div>
    </div>
    <div class="stat-card">
        <h3>Platillo Más Vendido</h3>
        <div class="value" style="font-size: 1.5rem; line-height: 1.2; margin-top: 10px;">
            @if($bestDish)
                {{ $bestDish->name }}
            @else
                Sin datos aún
            @endif
        </div>
    </div>
</div>

<div style="background: var(--card-bg); padding: 2rem; border-radius: 4px; box-shadow: var(--shadow-1);">
    <h2 style="margin-bottom: 1.5rem; color: var(--text-primary); font-weight: 500;">Acciones Rápidas</h2>
    <div style="display: flex; gap: 1rem;">
        <a href="{{ route('admin.dishes.create') }}" class="btn-primary">+ Nuevo Platillo</a>
        <a href="{{ route('admin.orders.index') }}" class="btn-primary" style="background: rgba(0,0,0,0.04); color: var(--text-primary); box-shadow: none;">Ver Pedidos Activos</a>
    </div>
</div>
@endsection
