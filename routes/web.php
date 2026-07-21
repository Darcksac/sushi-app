<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect('/login');
});

Route::get('/dashboard', [\App\Http\Controllers\ClientController::class, 'menu'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::post('/checkout', [\App\Http\Controllers\ClientController::class, 'checkout'])->name('client.checkout');
    Route::get('/mis-pedidos', [\App\Http\Controllers\ClientController::class, 'history'])->name('client.history');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
    Route::resource('dishes', \App\Http\Controllers\Admin\DishController::class);
    Route::resource('orders', \App\Http\Controllers\Admin\OrderController::class)->only(['index', 'show', 'update']);
    Route::resource('users', \App\Http\Controllers\Admin\UserController::class);
});

Route::post('/auth/firebase/login', [\App\Http\Controllers\Auth\GoogleAuthController::class, 'login'])->name('auth.firebase');

require __DIR__.'/auth.php';
