@extends('layouts.admin')

@section('content')
<div class="header">
    <div>
        <h1>Nuevo Platillo</h1>
        <p style="color: #a0a0a0; margin-top: 0.5rem;">Agrega un nuevo platillo al menú.</p>
    </div>
    <a href="{{ route('admin.dishes.index') }}" class="btn-primary" style="background: #333; color: white;">Volver</a>
</div>

<div style="background: var(--card-bg); padding: 2rem; border-radius: 4px; box-shadow: var(--shadow-1); max-width: 600px;">
    <form action="{{ route('admin.dishes.store') }}" method="POST" enctype="multipart/form-data">
        @csrf
        <div style="margin-bottom: 1.5rem;">
            <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">Nombre del Platillo</label>
            <input type="text" name="name" required style="width: 100%; padding: 0.8rem; border-radius: 4px;">
        </div>

        <div style="margin-bottom: 1.5rem;">
            <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">Descripción</label>
            <textarea name="description" rows="3" style="width: 100%; padding: 0.8rem; border-radius: 4px;"></textarea>
        </div>

        <div style="margin-bottom: 1.5rem;">
            <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">Precio</label>
            <input type="number" step="0.01" name="price" required style="width: 100%; padding: 0.8rem; border-radius: 4px;">
        </div>

        <div style="margin-bottom: 1.5rem;">
            <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">Imagen (opcional)</label>
            <input type="file" name="image" style="color: var(--text-primary);">
        </div>

        <div style="margin-bottom: 2rem;">
            <label style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-primary); cursor: pointer; font-size: 0.875rem;">
                <input type="checkbox" name="is_available" checked style="width: 1.2rem; height: 1.2rem;">
                Disponible para la venta
            </label>
        </div>

        <button type="submit" class="btn-primary" style="width: 100%;">Guardar Platillo</button>
    </form>
</div>
@endsection
