<?php

namespace App\Http\Controllers\Kasir;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\LaundryService;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $sort = $request->input('sort', 'created_at');
        $direction = $request->input('direction', 'desc');
        $search = $request->input('search');
        $status = $request->input('status');

        $transactions = Transaction::with('user')
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('receipt_number', 'like', "%{$search}%")
                      ->orWhereHas('user', function ($q) use ($search) {
                          $q->where('name', 'like', "%{$search}%");
                      });
                });
            })
            ->when($status && $status !== 'all', function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->orderBy($sort, $direction)
            ->when($sort !== 'created_at', function ($query) use ($direction) {
                return $query->orderBy('created_at', $direction);
            })
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Kasir/Transactions/Index', [
            'transactions' => $transactions,
            'users' => User::where('role', 'pelanggan')->get(),
            'services' => LaundryService::all(),
            'filters' => $request->only(['sort', 'direction', 'search', 'status']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Kasir/Transactions/Create', [
            'services' => LaundryService::all(),
            'customers' => User::where('role', 'pelanggan')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'payment_method' => 'required|string',
            'payment_status' => 'required|in:paid,unpaid',
            'date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.service_id' => 'required|exists:laundry_services,id',
            'items.*.weight' => 'required|numeric|min:0.1',
            'items.*.price' => 'required|numeric|min:0',
        ]);

        $totalPrice = collect($request->items)->sum('price');
        $totalWeight = collect($request->items)->sum('weight');

        $transaction = Transaction::create([
            'user_id' => $validated['user_id'],
            'receipt_number' => 'TRX-' . strtoupper(uniqid()),
            'status' => 'pending',
            'total_price' => $totalPrice,
            'total_weight' => $totalWeight,
            'payment_method' => $validated['payment_method'],
            'payment_status' => $validated['payment_status'],
            'date' => $validated['date'],
        ]);

        foreach ($request->items as $item) {
            $transaction->items()->create($item);
        }

        return redirect()->route('kasir.transactions.index')
            ->with('success', 'Transaksi berhasil dibuat.');
    }

    public function show(Transaction $transaction)
    {
        $transaction->load(['user', 'service', 'items.service']);
        return Inertia::render('Kasir/Transactions/Show', [
            'transaction' => $transaction
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Transaction $transaction)
    {
        $oldStatus = $transaction->status;
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'status' => 'required|string|in:pending,washing,ironing,done,delivered',
            'payment_status' => 'required|string|in:paid,unpaid',
            'payment_method' => 'required|string',
            'date' => 'required|date',
            'items' => 'sometimes|array',
            'items.*.service_id' => 'required_with:items|exists:laundry_services,id',
            'items.*.weight' => 'required_with:items|numeric|min:0',
            'items.*.price' => 'required_with:items|numeric|min:0',
        ]);

        if (isset($validated['items'])) {
            $transaction->items()->delete();
            foreach ($validated['items'] as $item) {
                $transaction->items()->create($item);
            }
            $validated['total_price'] = collect($validated['items'])->sum('price');
            $validated['total_weight'] = collect($validated['items'])->sum('weight');
        }

        $transaction->update($validated);

        // Notify user if status changed
        if ($oldStatus !== $transaction->status) {
            $statusLabels = [
                'pending' => 'Diterima',
                'washing' => 'Proses Cuci',
                'ironing' => 'Proses Setrika',
                'done' => 'Selesai',
                'delivered' => 'Sudah Diambil',
            ];
            $label = $statusLabels[$transaction->status] ?? $transaction->status;
            $transaction->user->notify(new \App\Notifications\OrderStatusChanged($transaction, "Status pesanan #{$transaction->receipt_number} berubah menjadi: {$label}."));
        }

        return redirect()->back()->with('success', 'Data transaksi berhasil diperbarui.');
    }
}
