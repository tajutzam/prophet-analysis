# Umaklin Laundry AI 🧺✨

Umaklin adalah platform manajemen laundry modern yang ditenagai oleh Kecerdasan Buatan (AI) untuk membantu pemilik laundry mengelola operasional sekaligus memprediksi tren transaksi di masa depan. Proyek ini menggabungkan kekuatan **Laravel 13** untuk sistem inti dan **FastAPI (Python)** untuk layanan analitik tingkat lanjut.

## 🏗️ Arsitektur Sistem

Sistem ini terbagi menjadi dua komponen utama yang saling berkomunikasi:

1.  **[Web App (Laravel + React)](./umaklin-web)**: Interface utama bagi pelanggan dan kasir. Menangani transaksi, manajemen profil, dan visualisasi data.
2.  **[AI Service (Python FastAPI)](./python-service)**: Backend analitik yang memproses data historis menggunakan Meta Prophet untuk memberikan estimasi beban kerja dan tren pendapatan.

## 🛠️ Tech Stack

### Core System
- **Backend**: Laravel 13, Inertia.js
- **Frontend**: React (TypeScript), Tailwind CSS
- **Database**: MySQL / MariaDB
- **Icons**: Lucide React
- **Charts**: Recharts

### AI & Analytics
- **Language**: Python 3.10+
- **Framework**: FastAPI
- **Forecasting Engine**: Meta Prophet
- **Execution**: Uvicorn (Asynchronous)

## 📁 Struktur Proyek

```text
.
├── umaklin-web/         # Laravel 13 & React (Frontend + Business Logic)
├── python-service/      # FastAPI & Meta Prophet (AI Forecasting)
├── docs/                # Dokumentasi teknis tambahan
└── diagrams.md          # Visualisasi arsitektur (Mermaid)
```

## 🚀 Cara Menjalankan

### 1. Prasyarat
- PHP 8.2+ & Composer
- Node.js & NPM
- Python 3.10+ & Pip
- MySQL Server

### 2. Menjalankan Web App
```bash
cd umaklin-web
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve
# Di terminal terpisah
npm run dev
```

### 3. Menjalankan AI Service
```bash
cd python-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```
*Umaklin - Clean clothes, smart business.*
