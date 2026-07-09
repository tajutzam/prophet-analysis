<?php

namespace App\Http\Controllers\Kasir;

use App\Http\Controllers\Controller;
use App\Services\AiForecastingService;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Cache;

class DashboardController extends Controller
{
    public function index(Request $request, AiForecastingService $aiService)
    {
        $servicePeriod = $request->input('service_period', '1M');

        // Cache stats computation for 5 minutes to avoid redundant counting
        $stats = Cache::remember('dashboard_stats', 300, function () {
            $totalCustomers = User::where('role', 'pelanggan')->count();
            $repeatCustomers = User::where('role', 'pelanggan')
                ->whereHas('transactions', null, '>', 1)
                ->count();

            $retentionRate = $totalCustomers > 0 ? round(($repeatCustomers / $totalCustomers) * 100, 1) : 0;

            return [
                'total_transactions_today' => Transaction::whereDate('date', today())->count(),
                'total_revenue_month' => Transaction::whereMonth('date', today()->month)
                    ->where('payment_status', 'paid')
                    ->sum('total_price'),
                'total_customers' => $totalCustomers,
                'pending_orders' => Transaction::whereIn('status', ['pending', 'washing', 'ironing'])->count(),
                'retention_rate' => $retentionRate,
            ];
        });

        // 2. Get AI Forecast data (cached in AiForecastingService)
        $forecastData = $aiService->getForecast(30);
        $timeSeriesData = $aiService->getForecastTimeSeries(1095);
        $inventoryAdvisory = $aiService->getInventoryAdvisory($servicePeriod);
        $crmInsights = $aiService->getCrmInsights();

        return Inertia::render('Kasir/Dashboard', [
            'stats' => $stats,
            'forecast' => $forecastData['status'] === 'success' ? $forecastData['data'] : null,
            'timeSeries' => $timeSeriesData['status'] === 'success' ? $timeSeriesData['data']['timeseries'] : null,
            'inventory' => $inventoryAdvisory,
            'crm' => $crmInsights,
            'forecastError' => $forecastData['status'] === 'error' ? $forecastData['message'] : null,
            'timeSeriesError' => $timeSeriesData['status'] === 'error' ? $timeSeriesData['message'] : null,
        ]);
    }
}
