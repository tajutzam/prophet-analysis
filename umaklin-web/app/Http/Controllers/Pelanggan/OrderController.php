<?php

namespace App\Http\Controllers\Pelanggan;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\LaundryService;
use App\Notifications\OrderStatusChanged;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function create()
    {
        $services = LaundryService::all();
        return Inertia::render('Pelanggan/CreateOrder', [
            'services' => $services
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'services' => 'required|array|min:1',
            'services.*.id' => 'required|exists:laundry_services,id',
            'services.*.weight' => 'required|numeric|min:0.1',
            'payment_method' => 'required|string|in:cash,transfer,qris',
            'notes' => 'nullable|string|max:500',
        ]);

        // Generate a receipt number for the request
        $receipt_number = 'REQ-' . date('Ymd') . '-' . strtoupper(Str::random(6));

        $totalWeight = 0;
        $totalPrice = 0;
        $primaryServiceId = $request->services[0]['id'];

        foreach ($request->services as $s) {
            $service = LaundryService::find($s['id']);
            $totalWeight += $s['weight'];
            $totalPrice += ($s['weight'] * $service->price_per_kg);
        }

        $transaction = Transaction::create([
            'user_id' => $request->user()->id,
            'receipt_number' => $receipt_number,
            'service_id' => $primaryServiceId,
            'total_weight' => $totalWeight,
            'total_price' => $totalPrice,
            'status' => 'pending',
            'payment_method' => $request->payment_method,
            'notes' => $request->notes,
            'date' => date('Y-m-d'),
        ]);

        // Create transaction items for each service
        foreach ($request->services as $s) {
            $service = LaundryService::find($s['id']);
            $transaction->items()->create([
                'service_id' => $s['id'],
                'weight' => $s['weight'],
                'price' => $s['weight'] * $service->price_per_kg,
            ]);
        }

        // Notify user
        $request->user()->notify(new OrderStatusChanged($transaction, "Pesanan #{$transaction->receipt_number} berhasil dibuat."));

        return redirect()->route('pelanggan.orders')->with('success', 'Pesanan berhasil dibuat! Silakan antar pakaian Anda ke gerai Umaklin.');
    }

    public function show(Request $request, Transaction $transaction)
    {
        // Ensure the transaction belongs to the customer
        if ($transaction->user_id !== $request->user()->id) {
            abort(403);
        }

        $transaction->load(['service', 'items']);

        return Inertia::render('Pelanggan/OrderDetail', [
            'transaction' => $transaction
        ]);
    }
}
