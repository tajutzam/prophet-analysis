<?php

namespace App\Http\Controllers\Pelanggan;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $recentTransactions = Transaction::where('user_id', $user->id)
            ->latest()
            ->take(5)
            ->get();

        $totalOrders = Transaction::where('user_id', $user->id)->count();

        $totalSpending = Transaction::where('user_id', $user->id)
            ->whereIn('status', ['done', 'delivered'])
            ->sum('total_price');

        return Inertia::render('Pelanggan/Dashboard', [
            'recent_transactions' => $recentTransactions,
            'stats' => [
                'total_orders' => $totalOrders,
                'total_spending' => (string) $totalSpending,
                'points' => $user->points ?? 0,
            ]
        ]);
    }

    public function orders(Request $request)
    {
        $transactions = Transaction::where('user_id', $request->user()->id)
            ->latest()
            ->get();
        return Inertia::render('Pelanggan/Orders', [
            'transactions' => $transactions
        ]);
    }
}
