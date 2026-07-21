@extends('layouts.admin')

@section('content')
<div class="header">
    <div>
        <h1>Platillos</h1>
        <p style="color: #a0a0a0; margin-top: 0.5rem;">Gestiona el menú de tu negocio de sushi.</p>
    </div>
    <a href="{{ route('admin.dishes.create') }}" class="btn-primary">+ Nuevo Platillo</a>
</div>

<table class="data-table">
    <thead>
        <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Estado</th>
            <th>Acciones</th>
        </tr>
    </thead>
    <tbody>
        @forelse($dishes as $dish)
            <tr>
                <td>
                    <div style="font-weight: 500; color: var(--text-primary);">{{ $dish->name }}</div>
                    <div style="font-size: 0.85rem; color: var(--text-secondary);">{{ Str::limit($dish->description, 50) }}</div>
                </td>
                <td style="font-weight: 500;">${{ number_format($dish->price, 2) }}</td>
                <td>
                    @if($dish->is_available)
                        <span class="badge entregado">Disponible</span>
                    @else
                        <span class="badge cancelado">Agotado</span>
                    @endif
                </td>
                <td>
                    <div style="display: flex; gap: 0.5rem;">
                        <a href="{{ route('admin.dishes.edit', $dish) }}" class="btn-primary" style="background: #1976d2; box-shadow: none;">Editar</a>
                        <form action="{{ route('admin.dishes.destroy', $dish) }}" method="POST" onsubmit="return confirm('¿Seguro que deseas eliminar este platillo?');">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="btn-primary" style="background: #f44336; box-shadow: none;">Eliminar</button>
                        </form>
                    </div>
                </td>
            </tr>
        @empty
            <tr>
                <td colspan="4" style="text-align: center; color: var(--text-secondary); padding: 2rem;">No hay platillos registrados aún.</td>
            </tr>
        @endforelse
    </tbody>
</table>
@endsection
