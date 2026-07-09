# Umaklin Web App (Laravel + React) 🌐🧺

Ini adalah antarmuka utama sistem Umaklin yang menghubungkan admin, kasir, dan pelanggan dalam satu platform terpadu.

## 🌟 Fitur Utama
- **Landing Page Modern**: Desain minimalist premium dengan integrasi Google Maps dan katalog layanan publik.
- **Manajemen Profil**: Pengguna dapat mengedit profil, mengunggah avatar, dan mengelola informasi kontak secara mandiri.
- **Role-based Access**:
    - **Kasir/Admin**: Manajemen transaksi, layanan, dan dashboard analitik.
    - **Pelanggan**: Tracking status laundry dan riwayat pesanan.
- **Interaksi AI**: Visualisasi hasil prediksi dari Python Service menggunakan grafik interaktif Recharts.

## 🛠️ Tech Stack
- **Backend**: Laravel 13
- **Frontend**: React (TypeScript)
- **Engine**: Inertia.js (No-API approach)
- **Styling**: Tailwind CSS
- **Authentication**: Laravel Breeze

## 🚀 Instalasi & Menjalankan

1. **Install Dependensi Backend**:
   ```bash
   composer install
   ```

2. **Install Dependensi Frontend**:
   ```bash
   npm install
   ```

3. **Konfigurasi Environment**:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Database & Storage**:
   ```bash
   php artisan migrate --seed
   php artisan storage:link
   ```

5. **Jalankan Aplikasi**:
   - Jalankan Server Laravel: `php artisan serve`
   - Jalankan Vite Assets: `npm run dev`

## 🎨 UI Aesthetics
Aplikasi ini menggunakan filosofi desain minimalist premium dengan:
- **Typography**: Inter / Sans-serif yang bersih.
- **Components**: Custom component dengan glassmorphism dan floating navigation.
- **Icons**: Lucide React.

---
*Umaklin - Professional Laundry Management.*
