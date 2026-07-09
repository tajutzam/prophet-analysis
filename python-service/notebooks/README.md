# 🧺 Umaklin Laundry - Strategic Forecasting System

Sistem analisis dan peramalan transaksi laundry profesional yang dirancang untuk keperluan akademis (skripsi) dan optimasi bisnis nyata menggunakan algoritma **Meta Prophet**.

## 🚀 Fitur Utama
Sistem ini mengotomatisasi seluruh lifecycle data science laundry, mencakup:
*   **Time Series Forecasting**: Prediksi volume transaksi harian hingga 3 tahun ke depan.
*   **Classification Diagnostics**: Evaluasi performa model dengan F1-Score, Accuracy, Precision, Recall, Confusion Matrix, dan ROC-AUC.
*   **Predictive CRM**: Deteksi otomatis pelanggan yang hilang (**Churn Prediction**) dan estimasi nilai ekonomi masa depan (**Customer Lifetime Value**).
*   **AI Supply Chain**: Kalkulasi otomatis titik pesan ulang stok deterjen (**Reorder Point**) dan cadangan aman (**Safety Stock**).
*   **Business Intelligence**: 26 grafik resolusi tinggi (300 DPI) dan Laporan Eksekutif Multi-Sheet (Excel).

## 🛠️ Tech Stack
*   **Core**: Python 3.x
*   **Forecasting**: Facebook/Meta Prophet
*   **ML Evaluation**: Scikit-Learn
*   **Data Analysis**: Pandas, Numpy, Scipy
*   **Visualization**: Matplotlib, Seaborn
*   **Reporting**: OpenPyXL

## 📊 Alur Kerja (28 Tahap Analisis)
1.  **Inisialisasi**: Setup direktori dan verifikasi dependensi.
2.  **Ingesti Data**: Konsolidasi data transaksi dari file Excel.
3.  **Data Cleaning**: Penanganan nilai kosong, outlier, dan sinkronisasi tanggal.
4.  **Feature Engineering**: Pembuatan fitur temporal, siklus gajian, dan weekend effect.
5.  **EDA (Level 1-3)**: Eksplorasi tren, musiman, densitas transaksi, dan performa admin.
6.  **Uji Statistik**: Uji normalitas dan stasioneritas (ADF/Rolling Stats).
7.  **Advanced Modeling**: Konfigurasi Prophet dengan Libur Nasional Indonesia.
8.  **Diagnostic Model**: Cross-validation, metrics regresi (WAPE, RMSE), dan metrik klasifikasi (ROC-AUC).
9.  **CRM & Segmentation**: Analisis RFM dan Churn Prediction.
10. **Logistik & Strategi**: Proyeksi Multi-Horizon, What-If Scenario, dan Inventory AI.
11. **Final Reporting**: Ekspor laporan eksekutif dan kesimpulan manajerial.

## 🏁 Cara Menjalankan
Pastikan virtual environment telah aktif, kemudian jalankan skrip utama:

```bash
# Dari root direktori python-service
./venv/bin/python3 notebooks/prophet_laundry_analysis.py
```

## 📁 Struktur Output
*   `/visualizations/`: Berisi 26 file PNG hasil analisis grafis.
*   `/models/`: Berisi model tersimpan dalam format `.json` dan `.pkl`.
*   `LAPORAN_EKSEKUTIF_...xlsx`: Laporan detail dalam format Excel untuk pihak manajemen.

---
**Developed by:** Antigravity AI Analyst
**Status:** Production Ready / Thesis Template Optimized
