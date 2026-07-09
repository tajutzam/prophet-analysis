<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Kasir\DashboardController as KasirDashboardController;
use App\Http\Controllers\Pelanggan\DashboardController as PelangganDashboardController;
use App\Http\Controllers\Kasir\TransactionController;
use App\Http\Controllers\Kasir\LaundryServiceController;
use App\Http\Controllers\Kasir\CustomerController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/services', function () {
    return Inertia::render('Services', [
        'services' => \App\Models\LaundryService::all(),
    ]);
})->name('services');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Route untuk Pelanggan (Default redirect after login if role == pelanggan)
    Route::middleware('role:pelanggan')->prefix('pelanggan')->name('pelanggan.')->group(function () {
        Route::get('/dashboard', [PelangganDashboardController::class, 'index'])->name('dashboard');
        Route::get('/orders', [PelangganDashboardController::class, 'orders'])->name('orders');
        Route::get('/orders/create', [\App\Http\Controllers\Pelanggan\OrderController::class, 'create'])->name('orders.create');
        Route::post('/orders', [\App\Http\Controllers\Pelanggan\OrderController::class, 'store'])->name('orders.store');
        Route::get('/orders/{transaction}', [\App\Http\Controllers\Pelanggan\OrderController::class, 'show'])->name('orders.show');

        // Notifications
        Route::get('/notifications', [App\Http\Controllers\Pelanggan\NotificationController::class, 'index'])->name('notifications.index');
        Route::post('/notifications/{id}/read', [App\Http\Controllers\Pelanggan\NotificationController::class, 'markAsRead'])->name('notifications.read');
    });

    // Route untuk Kasir
    Route::middleware('role:kasir')->prefix('kasir')->name('kasir.')->group(function () {
        Route::get('/dashboard', [KasirDashboardController::class, 'index'])->name('dashboard');
        Route::resource('transactions', TransactionController::class);
        Route::resource('services', LaundryServiceController::class);
        Route::resource('customers', CustomerController::class);
    });

    // Handle generic /dashboard route based on role
    Route::get('/dashboard', function () {
        if (request()->user()->role === 'kasir') {
            return redirect()->route('kasir.dashboard');
        }
        return redirect()->route('pelanggan.dashboard');
    })->name('dashboard');
});

require __DIR__.'/auth.php';
