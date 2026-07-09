import pandas as pd
from prophet import Prophet
import joblib
import os
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, Tuple, Optional
from app.core.config import settings
from app.core.logger import logger

class ModelService:
    def __init__(self, model_dir: str = settings.MODEL_DIR):
        self.model_dir = model_dir
        self.model_path = settings.model_path
        self.model: Optional[Prophet] = None

    def _add_regressors(self, df: pd.DataFrame) -> pd.DataFrame:
        """Helper to add smart features to the dataframe."""
        df = df.copy()
        # 1. Is_Weekend: 1 for Sat/Sun, 0 for others
        df['Is_Weekend'] = df['ds'].dt.weekday.apply(lambda x: 1 if x >= 5 else 0)
        
        # 2. Gajian_Effect: 1 for dates between 25th and 5th
        df['Gajian_Effect'] = df['ds'].dt.day.apply(lambda x: 1 if x >= 25 or x <= 5 else 0)
        return df

    def train(self, df: pd.DataFrame) -> Dict:
        if df.empty or len(df) < 2:
            raise ValueError("Insufficient data for training.")

        logger.info("Training Prophet model with Weekend & Payday effects...")
        
        # Add features
        df = self._add_regressors(df)

        self.model = Prophet(
            yearly_seasonality=True,
            weekly_seasonality=True,
            daily_seasonality=False,
            seasonality_mode='multiplicative'
        )
        
        # Register regressors
        self.model.add_regressor('Is_Weekend')
        self.model.add_regressor('Gajian_Effect')
        
        self.model.fit(df)
        self.save_model()
        return {"status": "success", "data_points": len(df)}

    def save_model(self):
        if self.model:
            os.makedirs(self.model_dir, exist_ok=True)
            joblib.dump(self.model, self.model_path)
            logger.info(f"Model saved to {self.model_path}")

    def load_model(self) -> bool:
        if os.path.exists(self.model_path):
            try:
                self.model = joblib.load(self.model_path)
                return True
            except Exception:
                return False
        return False

    def forecast(self, periods: int = 30) -> pd.DataFrame:
        if not self.model and not self.load_model():
            raise ValueError("Model is not trained.")

        # Determine start date
        last_date = self.model.history['ds'].max()
        today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        
        days_to_today = (today - last_date).days
        total_periods = max(periods, days_to_today + periods)

        # Create future dataframe and add regressors
        future = self.model.make_future_dataframe(periods=total_periods)
        future = self._add_regressors(future)
        
        # Predict
        forecast = self.model.predict(future)
        
        # Filter starting from today
        return forecast[forecast['ds'] >= today].head(periods)

model_service = ModelService()
