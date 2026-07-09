from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class ForecastItem(BaseModel):
    date: str
    predicted_orders: float
    upper: float
    lower: float

class Metrics(BaseModel):
    mae: float
    mape: str
    data_points: int

class ForecastResponse(BaseModel):
    status: str
    data: Dict[str, Any]

class TrainingResponse(BaseModel):
    status: str
    message: str
    metrics: Metrics

class StatsResponse(BaseModel):
    status: str
    summary: Dict[str, Any]
