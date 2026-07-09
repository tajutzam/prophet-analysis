<?php

namespace Database\Seeders;

use App\Models\LaundryService;
use Illuminate\Database\Seeder;

class LaundryServiceSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            // Kategori Reguler
            ['name' => 'Cuci Kering Regular', 'price_per_kg' => 6000, 'duration_hours' => 48, 'type' => 'regular'],
            ['name' => 'Cuci Kering + Setrika Regular', 'price_per_kg' => 8000, 'duration_hours' => 72, 'type' => 'regular'],
            ['name' => 'Setrika Saja Regular', 'price_per_kg' => 5000, 'duration_hours' => 24, 'type' => 'regular'],
            
            // Kategori Ekspres
            ['name' => 'Cuci Kering Kilat (12 Jam)', 'price_per_kg' => 10000, 'duration_hours' => 12, 'type' => 'express'],
            ['name' => 'Cuci Komplit Kilat (12 Jam)', 'price_per_kg' => 14000, 'duration_hours' => 12, 'type' => 'express'],
            ['name' => 'Cuci Komplit Super Kilat (6 Jam)', 'price_per_kg' => 20000, 'duration_hours' => 6, 'type' => 'express'],

            // Kategori Premium / Satuan
            ['name' => 'Bedcover / Selimut Besar', 'price_per_kg' => 30000, 'duration_hours' => 48, 'type' => 'premium'],
            ['name' => 'Cuci Sepatu (Deep Clean)', 'price_per_kg' => 45000, 'duration_hours' => 72, 'type' => 'premium'],
            ['name' => 'Cuci Helm Premium', 'price_per_kg' => 25000, 'duration_hours' => 24, 'type' => 'premium'],
        ];

        foreach ($services as $service) {
            LaundryService::create($service);
        }
    }
}
