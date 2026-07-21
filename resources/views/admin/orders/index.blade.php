@extends('layouts.admin')

@section('content')
<div class="header">
    <div>
        <h1>Pedidos</h1>
        <p style="color: #a0a0a0; margin-top: 0.5rem;">Gestiona los pedidos de tus clientes.</p>
    </div>
</div>

<div style="display: flex; flex-direction: column; gap: 1.5rem;">
    @forelse($orders as $order)
        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 4px; box-shadow: var(--shadow-1); display: flex; justify-content: space-between; align-items: center;">
            <div>
                <div style="font-weight: 500; color: var(--text-primary); font-size: 1.25rem; margin-bottom: 0.5rem;">
                    Pedido #{{ $order->id }} - {{ $order->user->name }}
                </div>
                <div style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 1rem;">
                    {{ $order->created_at->format('d/m/Y H:i A') }}
                </div>
                
                <ul style="list-style: none; color: var(--text-primary); font-size: 0.875rem; margin-bottom: 1rem;">
                    @foreach($order->items as $item)
                        <li>{{ $item->quantity }}x {{ $item->dish->name ?? 'Platillo Eliminado' }} - ${{ number_format($item->price, 2) }}</li>
                    @endforeach
                </ul>
                <div style="font-size: 1.25rem; font-weight: 500; color: var(--text-primary);">
                    Total: ${{ number_format($order->total, 2) }}
                </div>
            </div>
            
            <div style="text-align: right;">
                <div style="margin-bottom: 1rem;">
                    <span class="badge {{ strtolower($order->status) }}">{{ $order->status }}</span>
                </div>
                
                <form action="{{ route('admin.orders.update', $order) }}" method="POST" style="display: flex; gap: 0.5rem; align-items: center;">
                    @csrf
                    @method('PUT')
                    <select name="status" style="padding: 0.6rem; border-radius: 4px;">
                        <option value="Pendiente" {{ $order->status == 'Pendiente' ? 'selected' : '' }}>Pendiente</option>
                        <option value="Preparando" {{ $order->status == 'Preparando' ? 'selected' : '' }}>Preparando</option>
                        <option value="Entregado" {{ $order->status == 'Entregado' ? 'selected' : '' }}>Entregado</option>
                        <option value="Cancelado" {{ $order->status == 'Cancelado' ? 'selected' : '' }}>Cancelado</option>
                    </select>
                    <button type="submit" class="btn-primary" style="height: auto; padding: 0.6rem 1rem;">Actualizar</button>
                </form>
            </div>
        </div>
    @empty
        <div style="text-align: center; color: #a0a0a0; padding: 2rem;">No hay pedidos aún.</div>
    @endforelse
</div>
@endsection
