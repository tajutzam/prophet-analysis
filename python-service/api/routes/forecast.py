from fastapi import APIRouter, HTTPException, Query
from app.services.model_service import model_service
from app.services.data_service import data_service
from app.services.insight_service import insight_service
from app.utils.visualization import VisualizationUtil
from api.schemas.response import ForecastResponse
from app.core.config import settings
from app.core.logger import logger

router = APIRouter(prefix="/forecast", tags=["forecasting"])

@router.get("/", response_model=ForecastResponse)
async def get_forecast(
    days: int = Query(settings.DEFAULT_FORECAST_PERIOD, ge=1, le=365),
    include_plot: bool = Query(False)
):
    """Generates future laundry order predictions."""
    try:
        # 1. Generate Forecast
        forecast_df = model_service.forecast(periods=days)
        
        # 2. Format response
        forecast_list = []
        for _, row in forecast_df.iterrows():
            forecast_list.append({
                "date": row['ds'].strftime('%Y-%m-%d'),
                "predicted_orders": round(row['yhat'], 2),
                "upper": round(row['yhat_upper'], 2),
                "lower": round(row['yhat_lower'], 2)
            })
            
        # 3. Generate Insight
        insight = insight_service.generate_insights(forecast_df)
        
        response_data = {
            "forecast": forecast_list,
            "insight": insight,
            "components": model_service.get_components()
        }
        
        # 4. Optional Plot
        if include_plot:
            df_raw = data_service.load_and_merge_excel()
            if not df_raw.empty:
                df_clean = data_service.clean_data(df_raw)
                df_ts = data_service.transform_to_timeseries(df_clean)
                fig = VisualizationUtil.create_forecast_plot(df_ts, forecast_df)
                response_data["plot_base64"] = VisualizationUtil.plot_to_base64(fig)

        return {
            "status": "success",
            "data": response_data
        }
    except Exception as e:
        logger.error(f"Forecasting failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
