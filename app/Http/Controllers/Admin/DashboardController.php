<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $todayEarnings = \App\Models\Order::whereDate('created_at', today())
            ->where('status', 'Entregado')
            ->sum('total');

        $weekEarnings = \App\Models\Order::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])
            ->where('status', 'Entregado')
            ->sum('total');

        $bestSellingDishId = \App\Models\OrderItem::select('dish_id', \DB::raw('SUM(quantity) as total_sold'))
            ->groupBy('dish_id')
            ->orderBy('total_sold', 'desc')
            ->first();

        $bestDish = null;
        if ($bestSellingDishId) {
            $bestDish = \App\Models\Dish::find($bestSellingDishId->dish_id);
        }

        $pendingOrders = \App\Models\Order::where('status', 'Pendiente')->count();

        return view('admin.dashboard', compact('todayEarnings', 'weekEarnings', 'bestDish', 'pendingOrders'));
    }
}
