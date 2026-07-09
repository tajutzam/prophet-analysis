import os
import sys
from fastapi import FastAPI, HTTPException, BackgroundTasks, Query, Body
from typing import Optional, List, Dict
import pandas as pd
import numpy as np

# Ensure the project root is in the python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.model_service import model_service
from app.services.data_service import data_service
from app.services.insight_service import insight_service
from app.core.logger import logger
from datetime import datetime, timedelta

app = FastAPI(
    title="Umaklin AI Engine",
    description="Payload-Driven AI Service",
    version="3.1.0"
)

def get_avg_ticket_size(df: pd.DataFrame) -> float:
    # Use 'y' (Grandtotal/Total Bayar) from new DataService standard
    if 'y' in df.columns and len(df) > 0:
        return float(df['y'].mean())
    return 25000.0

def get_avg_weight_per_order(df: pd.DataFrame) -> float:
    if 'total_weight' in df.columns and len(df) > 0:
        mean_weight = float(df['total_weight'].mean())
        if mean_weight > 0:
            return mean_weight
    return 3.5  # fallback weight per order

def get_avg_price_per_kg(df: pd.DataFrame) -> float:
    if 'y' in df.columns and 'total_weight' in df.columns and len(df) > 0:
        total_weight = df['total_weight'].sum()
        if total_weight > 0:
            return float(df['y'].sum() / total_weight)
    return 8000.0  # fallback price per kg

def prepare_data(payload: Dict):
    if payload and "transactions" in payload:
        data_service.set_data(payload["transactions"])

@app.get("/")
async def root():
    return {"status": "online", "mode": "payload", "model_loaded": model_service.model is not None}

@app.post("/forecast/strategic")
async def get_strategic_forecast(payload: Dict = Body(...)):
    try:
        prepare_data(payload)
        df = data_service.load_and_merge()
        if df.empty: return {"message": "No data provided"}
        
        avg_weight = get_avg_weight_per_order(df)
        avg_price_per_kg = get_avg_price_per_kg(df)
        forecast_df = model_service.forecast(periods=1095)
        
        horizons = {"1_day": 1, "3_days": 3, "1_week": 7, "1_month": 30, "1_year": 365, "3_years": 1095}
        results = {}
        for label, days in horizons.items():
            subset = forecast_df.head(days)
            total_orders = float(subset['yhat'].sum())
            total_weight = total_orders * avg_weight
            results[label] = {
                "total_orders": total_orders,
                "total_weight": round(total_weight, 2),
                "total_revenue": round(total_weight * avg_price_per_kg)
            }
        return results
    except Exception as e:
        logger.error(f"Strategic error: {e}"); raise HTTPException(status_code=500, detail=str(e))

@app.post("/forecast/timeseries")
async def get_timeseries_forecast(payload: Dict = Body(...)):
    try:
        prepare_data(payload)
        days = payload.get("days", 30)
        df = data_service.load_and_merge()
        avg_weight = get_avg_weight_per_order(df)
        avg_price_per_kg = get_avg_price_per_kg(df)
        
        # If model not trained, try training once with payload
        if model_service.model is None and not df.empty:
            clean_df = data_service.clean_data(df)
            ts_df = data_service.transform_to_timeseries(clean_df)
            model_service.train(ts_df)

        forecast_df = model_service.forecast(periods=days)
        timeseries_data = []
        for _, row in forecast_df.iterrows():
            pred_orders = float(row['yhat'])
            pred_weight = round(pred_orders * avg_weight, 2)
            timeseries_data.append({
                "date": row['ds'].strftime('%Y-%m-%d'), 
                "predicted_orders": round(pred_orders, 2), 
                "predicted_weight": pred_weight,
                "predicted_revenue": round(pred_weight * avg_price_per_kg, 0),
                "lower_bound": round(float(row['yhat_lower']), 2),
                "upper_bound": round(max(0, float(row['yhat_upper'])), 2)
            })
        return {"horizon_days": days, "timeseries": timeseries_data}
    except Exception as e:
        logger.error(f"TimeSeries error: {e}"); raise HTTPException(status_code=500, detail=str(e))

@app.post("/inventory/advisory")
async def get_inventory_advisory(payload: Dict = Body(...)):
    try:
        prepare_data(payload)
        period = payload.get("period", "1M")
        df = data_service.load_and_merge()
        if df.empty: return {"service_distribution": [], "stok_status": [], "message": "Menunggu data..."}
        
        forecast_df = model_service.forecast(periods=30)
        vol = float(forecast_df['yhat'].sum())
        
        period_map = {"1D": 1, "1W": 7, "1M": 30, "1Y": 365}
        days_count = period_map.get(period, 30)
        
        # Use 'ds' standard from DataService
        last_date = df['ds'].max()
        start_date = last_date - timedelta(days=days_count)
        filtered_df = df[df['ds'] > start_date]
            
        total_count = len(filtered_df)
        service_dist = []
        
        # In Laravel payload, we expect 'service_name' or 'service.name'
        name_col = 'service_name' if 'service_name' in df.columns else None
        if name_col and total_count > 0:
            top_services = filtered_df[name_col].value_counts().head(3)
            for name, count in top_services.items():
                service_df = filtered_df[filtered_df[name_col] == name]
                avg_p = float(service_df['y'].mean()) if 'y' in df.columns else 0
                service_dist.append({"name": str(name), "value": round((count / total_count) * 100, 1), "avg_price": f"Rp{round(avg_p/1000)}rb", "trend": "+2.5%"})
        
        metrics = [{"label": "Deterjen", "coef": 0.05, "unit": "L", "color": "bg-emerald-500", "limit": 50}, {"label": "Pewangi", "coef": 0.02, "unit": "L", "color": "bg-blue-500", "limit": 20}, {"label": "Plastik", "coef": 1.2, "unit": "pcs", "color": "bg-orange-500", "limit": 500}, {"label": "Hanger", "coef": 0.5, "unit": "pcs", "color": "bg-slate-800", "limit": 200}]
        stok_status = []
        for m in metrics:
            needed = vol * m['coef']
            width_val = min(95, max(15, (needed / m['limit']) * 100))
            stok_status.append({"label": m['label'], "val": f"{round(needed, 1)}{m['unit']}", "width": f"{round(width_val)}%", "color": m['color']})

        return {
            "total_transactions": str(total_count),
            "service_distribution": service_dist,
            "stok_status": stok_status,
            "message": f"Analisis {period} berbasis data real-time."
        }
    except Exception as e:
        logger.error(f"Inventory error: {e}"); return {"service_distribution": [], "stok_status": []}

@app.post("/crm/insights")
async def get_crm_insights(payload: Dict = Body(...)):
    try:
        prepare_data(payload)
        df = data_service.load_and_merge()
        if df.empty: return {"message": "Data sedang disiapkan..."}
        
        forecast_df = model_service.forecast(periods=30)
        retention_rate = 0
        if 'user_id' in df.columns:
            vc = df['user_id'].value_counts()
            retention_rate = round((len(vc[vc > 1]) / len(vc)) * 100, 1) if len(vc) > 0 else 0
        
        narrative = insight_service.generate_insights(forecast_df)
        return {"retention_rate": retention_rate, "retention_data": [], "message": narrative}
    except Exception as e:
        logger.error(f"CRM error: {e}"); return {"message": "Analisis loyalitas..."}

@app.post("/train")
async def train_model(payload: Dict = Body(...)):
    try:
        prepare_data(payload)
        df = data_service.load_and_merge()
        if df.empty: return {"status": "error", "message": "No data to train"}
        clean_df = data_service.clean_data(df)
        ts_df = data_service.transform_to_timeseries(clean_df)
        model_service.train(ts_df)
        return {"status": "success", "message": "Model trained with payload data"}
    except Exception as e: logger.error(f"Train error: {e}"); return {"status": "error"}

if __name__ == "__main__":
    import uvicorn; uvicorn.run(app, host="127.0.0.1", port=8088)
