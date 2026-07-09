<?php

namespace App\Services;

use App\Models\Transaction;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class AiForecastingService
{
    protected string $baseUrl;
    protected ?array $transactionPayloadCache = null;

    private const CACHE_TTL = 3600; // 1 hour
    private const PAYLOAD_CACHE_KEY = 'ai_service_transactions_payload_v2';

    public function __construct()
    {
        $this->baseUrl = rtrim(config('app.ai_service_url', 'http://ai-service:8001'), '/');
    }

    /**
     * Get recent transactions to send as payload to AI service.
     * Uses in-memory cache to avoid redundant database queries within single request.
     */
    protected function getTransactionsPayload(): array
    {
        // In-memory memoization to avoid redundant queries in single request
        if ($this->transactionPayloadCache !== null) {
            return $this->transactionPayloadCache;
        }

        try {
            // Check Redis/File cache first
            $cached = Cache::get(self::PAYLOAD_CACHE_KEY);
            if ($cached !== null) {
                $this->transactionPayloadCache = $cached;
                return $cached;
            }

            $services = \App\Models\LaundryService::all();
            $serviceNames = $services->pluck('name')->toArray();

            // Get all transactions with service names
            $payload = Transaction::with('service')
                ->get()
                ->map(function ($t) use ($serviceNames) {
                    $name = $t->service ? $t->service->name : 'Lainnya';

                    // If it's 'Lainnya', for visualization purposes, pick a random real service
                    // This is to solve the issue where dummy data doesn't have service_id
                    if ($name === 'Lainnya' && !empty($serviceNames)) {
                        $name = $serviceNames[array_rand($serviceNames)];
                    }

                    return [
                        'date' => $t->date,
                        'total_price' => (float) $t->total_price,
                        'total_weight' => (float) $t->total_weight,
                        'service_name' => $name,
                        'user_id' => $t->user_id,
                        'status' => $t->status
                    ];
                })
                ->toArray();

            // Cache the payload for 1 hour
            Cache::put(self::PAYLOAD_CACHE_KEY, $payload, self::CACHE_TTL);
            $this->transactionPayloadCache = $payload;

            return $payload;
        } catch (\Exception $e) {
            Log::error('Error preparing AI payload: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Get the forecast data from the AI service.
     */
    public function getForecast(int $days = 30): array
    {
        $cacheKey = "ai_forecast_v2_{$days}";

        // Check if cached
        $cached = Cache::get($cacheKey);
        if ($cached !== null) {
            return $cached;
        }

        try {
            $response = Http::acceptJson()
                ->timeout(120)
                ->post("{$this->baseUrl}/forecast/strategic", [
                    'transactions' => $this->getTransactionsPayload()
                ]);

            if ($response->successful()) {
                $result = ['status' => 'success', 'data' => $response->json()];
                // Cache successful responses for 1 hour
                Cache::put($cacheKey, $result, self::CACHE_TTL);
                return $result;
            }

            return ['status' => 'error', 'message' => 'Failed to retrieve forecast data.'];
        } catch (\Exception $e) {
            Log::error('AI Service Connection Error: ' . $e->getMessage());
            return ['status' => 'error', 'message' => 'Could not connect to AI Service.'];
        }
    }

    /**
     * Get the time-series forecast data from the AI service.
     */
    public function getForecastTimeSeries(int $days = 30): array
    {
        $cacheKey = "ai_timeseries_v2_{$days}";

        // Check if cached
        $cached = Cache::get($cacheKey);
        if ($cached !== null) {
            return $cached;
        }

        try {
            $response = Http::acceptJson()
                ->timeout(120)
                ->post("{$this->baseUrl}/forecast/timeseries", [
                    'days' => $days,
                    'transactions' => $this->getTransactionsPayload()
                ]);

            if ($response->successful()) {
                $result = ['status' => 'success', 'data' => $response->json()];
                // Cache successful responses for 1 hour
                Cache::put($cacheKey, $result, self::CACHE_TTL);
                return $result;
            }

            return ['status' => 'error', 'message' => 'Failed to retrieve time-series.'];
        } catch (\Exception $e) {
            Log::error('AI Service TimeSeries Error: ' . $e->getMessage());
            return ['status' => 'error', 'message' => 'Connection failed.'];
        }
    }

    /**
     * Get inventory advisory from the AI service.
     */
    public function getInventoryAdvisory(string $period = '1M'): array
    {
        $cacheKey = "ai_inventory_v2_{$period}";

        // Check if cached
        $cached = Cache::get($cacheKey);
        if ($cached !== null) {
            return $cached;
        }

        try {
            $response = Http::acceptJson()
                ->timeout(120)
                ->post("{$this->baseUrl}/inventory/advisory", [
                    'period' => $period,
                    'transactions' => $this->getTransactionsPayload()
                ]);

            if ($response->successful()) {
                $result = $response->json();
                // Cache successful responses for 1 hour
                Cache::put($cacheKey, $result, self::CACHE_TTL);
                return $result;
            }

            return [];
        } catch (\Exception $e) {
            Log::error('AI Service Inventory Error: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Get CRM insights from the AI service.
     */
    public function getCrmInsights(): array
    {
        $cacheKey = "ai_crm_insights_v2";

        // Check if cached
        $cached = Cache::get($cacheKey);
        if ($cached !== null) {
            return $cached;
        }

        try {
            $response = Http::acceptJson()
                ->timeout(120)
                ->post("{$this->baseUrl}/crm/insights", [
                    'transactions' => $this->getTransactionsPayload()
                ]);

            if ($response->successful()) {
                $result = $response->json();
                // Cache successful responses for 1 hour
                Cache::put($cacheKey, $result, self::CACHE_TTL);
                return $result;
            }

            return [];
        } catch (\Exception $e) {
            Log::error('AI Service CRM Insights Error: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Clear all AI service caches (useful when new data is added).
     * Call this when transactions are created/updated.
     */
    public static function clearCache(): void
    {
        Cache::forget(self::PAYLOAD_CACHE_KEY);
        Cache::forget('ai_forecast_v2_30');
        Cache::forget('ai_timeseries_v2_1095');
        Cache::forget('ai_inventory_v2_1M');
        Cache::forget('ai_inventory_v2_1W');
        Cache::forget('ai_inventory_v2_1D');
        Cache::forget('ai_inventory_v2_1Y');
        Cache::forget('ai_crm_insights_v2');
    }
}
