<?php

namespace App\Http\Controllers\Kasir;

use App\Http\Controllers\Controller;
use App\Models\LaundryService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LaundryServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Kasir/Services/Index', [
            'services' => LaundryService::all()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price_per_kg' => 'required|numeric|min:0',
            'duration_hours' => 'required|integer|min:1',
            'type' => 'required|string',
        ]);

        LaundryService::create($validated);

        return redirect()->back()->with('success', 'Layanan berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, LaundryService $laundryService)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price_per_kg' => 'required|numeric|min:0',
            'duration_hours' => 'required|integer|min:1',
            'type' => 'required|string',
        ]);

        $laundryService->update($validated);

        return redirect()->back()->with('success', 'Layanan berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LaundryService $laundryService)
    {
        $laundryService->delete();

        return redirect()->back()->with('success', 'Layanan berhasil dihapus.');
    }
}
