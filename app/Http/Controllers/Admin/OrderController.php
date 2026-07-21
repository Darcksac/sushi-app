<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {
        $orders = \App\Models\Order::with(['user', 'items.dish'])->latest()->get();
        return view('admin.orders.index', compact('orders'));
    }

    public function update(Request $request, \App\Models\Order $order)
    {
        $request->validate(['status' => 'required|in:Pendiente,Preparando,Entregado,Cancelado']);
        $order->update(['status' => $request->status]);
        return redirect()->route('admin.orders.index')->with('success', 'Estado del pedido actualizado.');
    }
}
