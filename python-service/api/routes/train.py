from fastapi import APIRouter, HTTPException
from app.services.data_service import data_service
from app.services.model_service import model_service
from api.schemas.response import TrainingResponse
from app.core.logger import logger

router = APIRouter(prefix="/train", tags=["training"])

@router.post("/", response_model=TrainingResponse)
async def train_model():
    """Triggers dataset loading, preprocessing, and Prophet model training."""
    try:
        # 1. Load and merge
        df_raw = data_service.load_and_merge_excel()
        if df_raw.empty:
            raise HTTPException(status_code=404, detail="No dataset found in datasets/ directory")
        
        # 2. Clean and Preprocess
        df_clean = data_service.clean_data(df_raw)
        df_ts = data_service.transform_to_timeseries(df_clean)
        
        # 3. Train
        metrics = model_service.train(df_ts)
        
        return {
            "status": "success",
            "message": "Model trained and saved successfully",
            "metrics": metrics
        }
    except Exception as e:
        logger.error(f"Training failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
