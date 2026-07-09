from fastapi import APIRouter, HTTPException
from app.services.data_service import data_service
from api.schemas.response import StatsResponse
from app.core.logger import logger

router = APIRouter(prefix="/stats", tags=["statistics"])

@router.get("/", response_model=StatsResponse)
async def get_dashboard_stats():
    """Returns summary statistics of historical transaction data."""
    try:
        df_raw = data_service.load_and_merge_excel()
        if df_raw.empty:
            return {
                "status": "success",
                "summary": {"message": "No data available"}
            }
            
        df_clean = data_service.clean_data(df_raw)
        stats = data_service.get_summary_stats(df_clean)
        
        return {
            "status": "success",
            "summary": stats
        }
    except Exception as e:
        logger.error(f"Stats retrieval failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
