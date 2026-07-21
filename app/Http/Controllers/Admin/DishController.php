<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DishController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $dishes = \App\Models\Dish::all();
        return view('admin.dishes.index', compact('dishes'));
    }

    public function create()
    {
        return view('admin.dishes.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'image' => 'nullable|image',
            'is_available' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('dishes', 'public');
            $validated['image'] = $path;
        }

        $validated['is_available'] = $request->has('is_available');

        \App\Models\Dish::create($validated);
        return redirect()->route('admin.dishes.index')->with('success', 'Platillo creado correctamente.');
    }

    public function edit(\App\Models\Dish $dish)
    {
        return view('admin.dishes.edit', compact('dish'));
    }

    public function update(Request $request, \App\Models\Dish $dish)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'image' => 'nullable|image',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('dishes', 'public');
            $validated['image'] = $path;
        }

        $validated['is_available'] = $request->has('is_available');

        $dish->update($validated);
        return redirect()->route('admin.dishes.index')->with('success', 'Platillo actualizado.');
    }

    public function destroy(\App\Models\Dish $dish)
    {
        $dish->delete();
        return redirect()->route('admin.dishes.index')->with('success', 'Platillo eliminado.');
    }
}
