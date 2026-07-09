<?php

namespace App\Http\Controllers\Kasir;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $totalCustomers = User::where('role', 'pelanggan')->count();
        $repeatCustomers = User::where('role', 'pelanggan')
            ->whereHas('transactions', null, '>', 1)
            ->count();
        
        $retentionRate = $totalCustomers > 0 ? round(($repeatCustomers / $totalCustomers) * 100, 1) : 0;

        return Inertia::render('Kasir/Customers/Index', [
            'customers' => User::where('role', 'pelanggan')
                ->when($search, function ($query, $search) {
                    $query->where(function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                          ->orWhere('email', 'like', "%{$search}%");
                    });
                })
                ->latest()
                ->paginate(10)
                ->withQueryString(),
            'filters' => $request->only(['search']),
            'stats' => [
                'total_customers' => $totalCustomers,
                'retention_rate' => $retentionRate,
            ]
        ]);
    }

    public function create()
    {
        return Inertia::render('Kasir/Customers/Create');
    }

    public function show(User $customer)
    {
        return Inertia::render('Kasir/Customers/Show', [
            'customer' => $customer,
            'transactions' => $customer->transactions()->latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'required|string|max:20',
            'address' => 'nullable|string',
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'address' => $validated['address'] ?? null,
            'password' => Hash::make('password'), // Default password
            'role' => 'pelanggan',
        ]);

        return redirect()->back()->with('success', 'Pelanggan berhasil ditambahkan.');
    }

    public function update(Request $request, User $customer)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $customer->id,
            'phone' => 'required|string|max:20',
            'address' => 'nullable|string',
        ]);

        $customer->update($validated);

        return redirect()->back()->with('success', 'Data pelanggan berhasil diperbarui.');
    }

    public function destroy(User $customer)
    {
        $customer->delete();
        return redirect()->back()->with('success', 'Pelanggan berhasil dihapus.');
    }
}
