<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = \App\Models\User::whereIn('role', ['admin', 'subadmin'])->get();
        return view('admin.users.index', compact('users'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $validated['password'] = bcrypt($validated['password']);
        $validated['role'] = 'subadmin'; // Always create as subadmin

        \App\Models\User::create($validated);
        return redirect()->route('admin.users.index')->with('success', 'Sub-Administrador creado.');
    }

    public function destroy(\App\Models\User $user)
    {
        if ($user->id === auth()->id()) {
            return redirect()->route('admin.users.index')->with('error', 'No puedes eliminarte a ti mismo.');
        }
        $user->delete();
        return redirect()->route('admin.users.index')->with('success', 'Usuario eliminado.');
    }
}
