<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin / Kasir
        User::create([
            'name' => 'Admin-Umaklin',
            'email' => 'admin@umaklin.com',
            'password' => Hash::make('password'),
            'role' => 'kasir',
            'phone' => '081234567890',
            'address' => 'Jl. Sudirman No. 10, Jakarta Pusat',
        ]);

        // Sample Customers
        $customers = [
            ['name' => 'Budi Santoso', 'email' => 'budi@gmail.com'],
            ['name' => 'Siti Aminah', 'email' => 'siti@yahoo.com'],
            ['name' => 'Andi Wijaya', 'email' => 'andi@outlook.com'],
            ['name' => 'Dewi Lestari', 'email' => 'dewi@gmail.com'],
            ['name' => 'Eko Prasetyo', 'email' => 'eko@gmail.com'],
        ];

        foreach ($customers as $customer) {
            User::create([
                'name' => $customer['name'],
                'email' => $customer['email'],
                'password' => Hash::make('password'),
                'role' => 'pelanggan',
                'phone' => '081' . rand(100000000, 999999999),
                'address' => 'Jl. Mawar No. ' . rand(1, 100),
            ]);
        }
    }
}
