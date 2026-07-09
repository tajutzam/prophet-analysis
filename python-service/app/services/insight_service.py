import pandas as pd
from typing import List, Dict
from app.core.logger import logger

class InsightService:
    def generate_insights(self, forecast_df: pd.DataFrame) -> str:
        """Generates human-readable insights from forecast data."""
        if forecast_df.empty:
            return "No data available for insights."

        avg_forecast = forecast_df['yhat'].mean()
        max_forecast = forecast_df['yhat'].max()
        max_date = forecast_df.loc[forecast_df['yhat'].idxmax(), 'ds'].strftime('%Y-%m-%d')
        
        trend_direction = "stabil"
        if len(forecast_df) > 1:
            first = forecast_df['yhat'].iloc[0]
            last = forecast_df['yhat'].iloc[-1]
            if last > first * 1.05:
                trend_direction = "meningkat"
            elif last < first * 0.95:
                trend_direction = "menurun"

        insight = (
            f"Berdasarkan analisis forecasting, rata-rata transaksi harian diprediksi sekitar {avg_forecast:.0f} order. "
            f"Trend transaksi terpantau {trend_direction}. "
            f"Volume transaksi tertinggi diprediksi terjadi pada tanggal {max_date} dengan estimasi {max_forecast:.0f} order."
        )
        
        return insight

insight_service = InsightService()
