@extends('layouts.admin')

@section('content')
<div class="header">
    <div>
        <h1>Administradores</h1>
        <p style="color: #a0a0a0; margin-top: 0.5rem;">Gestiona las cuentas con acceso al panel.</p>
    </div>
</div>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
    <!-- Lista de Administradores -->
    <div>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                @foreach($users as $user)
                    <tr>
                        <td>
                            <div style="font-weight: 500; color: var(--text-primary);">{{ $user->name }}</div>
                            <div style="font-size: 0.85rem; color: var(--text-secondary);">{{ $user->email }}</div>
                        </td>
                        <td>
                            @if($user->role === 'admin')
                                <span class="badge" style="background:#fff3e0; color:var(--accent-primary);">Admin Principal</span>
                            @else
                                <span class="badge" style="background:#e0e0e0; color:var(--text-primary);">Sub-Admin</span>
                            @endif
                        </td>
                        <td>
                            @if($user->id !== auth()->id())
                                <form action="{{ route('admin.users.destroy', $user) }}" method="POST" onsubmit="return confirm('¿Eliminar sub-administrador?');">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="btn-primary" style="background: #f44336; box-shadow: none;">Eliminar</button>
                                </form>
                            @endif
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <!-- Agregar Nuevo -->
    <div style="background: var(--card-bg); padding: 2rem; border-radius: 4px; box-shadow: var(--shadow-1); align-self: start;">
        <h2 style="margin-bottom: 1.5rem; color: var(--text-primary); font-weight: 500;">Agregar Sub-Administrador</h2>
        <form action="{{ route('admin.users.store') }}" method="POST">
            @csrf
            <div style="margin-bottom: 1.5rem;">
                <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">Nombre</label>
                <input type="text" name="name" required style="width: 100%; padding: 0.8rem; border-radius: 4px;">
            </div>
            <div style="margin-bottom: 1.5rem;">
                <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">Correo Electrónico</label>
                <input type="email" name="email" required style="width: 100%; padding: 0.8rem; border-radius: 4px;">
            </div>
            <div style="margin-bottom: 1.5rem;">
                <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">Contraseña Temporal</label>
                <input type="password" name="password" required style="width: 100%; padding: 0.8rem; border-radius: 4px;">
            </div>
            <button type="submit" class="btn-primary" style="width: 100%;">Crear Cuenta</button>
        </form>
    </div>
</div>
@endsection
