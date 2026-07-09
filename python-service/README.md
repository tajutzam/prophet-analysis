# Umaklin AI Service (Python) 🤖📈

Layanan ini adalah komponen analitik dari Umaklin yang bertanggung jawab untuk melakukan pemrosesan data tingkat lanjut dan prediksi tren menggunakan machine learning.

## 🌟 Fitur Utama
- **Forecasting Transaksi**: Menggunakan Meta Prophet untuk memprediksi volume laundry di masa depan berdasarkan data historis (harian, mingguan, bulanan).
- **CRM Insights**: Analisis pola pelanggan untuk memberikan rekomendasi loyalitas.
- **Inventory Advisory**: Prediksi penggunaan stok bahan (deterjen, pewangi) berdasarkan estimasi beban kerja.
- **Laporan Otomatis**: Generate laporan eksekutif dalam format Excel/XLSX.

## 🛠️ Tech Stack
- **Framework**: FastAPI
- **Model**: Meta Prophet
- **Data Handling**: Pandas, NumPy
- **Server**: Uvicorn
- **Documentation**: Swagger UI (Auto-generated)

## 🚀 Instalasi & Menjalankan

1. **Persiapan Virtual Environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Mac/Linux
   # atau
   .\venv\Scripts\activate  # Windows
   ```

2. **Install Dependensi**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Konfigurasi Environment**:
   Salin `.env.example` (jika ada) ke `.env` dan sesuaikan pengaturan database.

4. **Jalankan Service**:
   ```bash
   uvicorn api.main:app --reload --port 8001
   ```

## 🔌 API Endpoints
Setelah dijalankan, dokumentasi lengkap tersedia di:
- **Interactive Docs**: `http://localhost:8001/docs`
- **Alternative Docs**: `http://localhost:8001/redoc`

---
*Powered by Meta Prophet & FastAPI.*
