<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function menu()
    {
        $dishes = \App\Models\Dish::where('is_available', true)->get();
        return view('dashboard', compact('dishes'));
    }

    public function checkout(Request $request)
    {
        $request->validate([
            'dish_id' => 'required|array',
            'quantity' => 'required|array',
        ]);

        $total = 0;
        $order = \App\Models\Order::create([
            'user_id' => auth()->id(),
            'total' => 0,
            'status' => 'Pendiente',
        ]);

        foreach ($request->dish_id as $index => $dishId) {
            $quantity = $request->quantity[$index];
            if ($quantity > 0) {
                $dish = \App\Models\Dish::find($dishId);
                if ($dish && $dish->is_available) {
                    $itemTotal = $dish->price * $quantity;
                    $total += $itemTotal;
                    
                    \App\Models\OrderItem::create([
                        'order_id' => $order->id,
                        'dish_id' => $dish->id,
                        'quantity' => $quantity,
                        'price' => $dish->price,
                    ]);
                }
            }
        }

        if ($total > 0) {
            $order->update(['total' => $total]);
            return redirect()->route('client.history')->with('success', '¡Tu pedido ha sido recibido con éxito!');
        } else {
            $order->delete();
            return redirect()->route('dashboard')->with('error', 'No seleccionaste ningún platillo.');
        }
    }

    public function history()
    {
        $orders = \App\Models\Order::where('user_id', auth()->id())
            ->with('items.dish')
            ->latest()
            ->get();
            
        return view('client.history', compact('orders'));
    }
}
