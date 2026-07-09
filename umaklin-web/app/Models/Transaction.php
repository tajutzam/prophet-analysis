<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Services\AiForecastingService;

class Transaction extends Model
{
    protected $fillable = [
        'receipt_number',
        'user_id',
        'service_id',
        'total_weight',
        'total_price',
        'status',
        'payment_status',
        'payment_method',
        'notes',
        'date'
    ];

    protected static function booted()
    {
        // Clear AI forecast cache when transactions are created or updated
        static::created(function (Transaction $transaction) {
            AiForecastingService::clearCache();
        });

        static::updated(function (Transaction $transaction) {
            AiForecastingService::clearCache();
        });

        static::deleted(function (Transaction $transaction) {
            AiForecastingService::clearCache();
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function service()
    {
        return $this->belongsTo(LaundryService::class);
    }

    public function items()
    {
        return $this->hasMany(TransactionItem::class);
    }
}
