<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LaundryService extends Model
{
    protected $fillable = [
        'name',
        'price_per_kg',
        'duration_hours',
        'type'
    ];
}
