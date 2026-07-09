<?php

namespace Database\Seeders;

use App\Models\Transaction;
use App\Models\User;
use App\Models\LaundryService;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class TransactionSeeder extends Seeder
{
    public function run(): void
    {
        $customers = User::where('role', 'pelanggan')->get();
        $services = LaundryService::all();

        if ($customers->isEmpty() || $services->isEmpty()) {
            return;
        }

        $startDate = Carbon::now()->subYear();
        $endDate = Carbon::now()->subDay();
        $statuses = ['pending', 'washing', 'ironing', 'done', 'delivered'];
        $paymentMethods = ['cash', 'transfer', 'qris'];

        $transactions = [];

        for ($date = $startDate->copy(); $date->lte($endDate); $date->addDay()) {


            $isWeekend = $date->isWeekend();
            $baseCount = $isWeekend ? rand(10, 20) : rand(3, 8);

            $dayOfMonth = $date->day;
            if ($dayOfMonth >= 25 || $dayOfMonth <= 5) {
                $baseCount = (int) ($baseCount * 1.5);
            }

            for ($i = 0; $i < $baseCount; $i++) {
                $service = $services->random();
                $weight = rand(2, 7);
                $totalPrice = $service->price_per_kg * $weight;

                if (rand(1, 10) > 8) $totalPrice += 5000;

                $transactions[] = [
                    // Stronger unique receipt number: TRX + YYMMDD + Random(6)
                    'receipt_number' => 'TRX-' . $date->format('ymd') . strtoupper(\Illuminate\Support\Str::random(6)),
                    'user_id' => $customers->random()->id,
                    'service_id' => $service->id,
                    'total_weight' => $weight,
                    'total_price' => $totalPrice,
                    'status' => $date->isToday() ? 'pending' : 'delivered',
                    'payment_status' => $date->diffInDays($endDate) > 1 ? 'paid' : (rand(0,1) ? 'paid' : 'unpaid'),
                    'payment_method' => $paymentMethods[array_rand($paymentMethods)],
                    'date' => $date->toDateString(),
                    'created_at' => $date->copy()->addHours(rand(8, 20)),
                    'updated_at' => $date->copy()->addHours(rand(21, 23)),
                ];

                if (count($transactions) >= 500) {
                    Transaction::insert($transactions);
                    $transactions = [];
                }
            }
        }

        // Insert remaining transactions
        if (!empty($transactions)) {
            Transaction::insert($transactions);
        }
    }
}
