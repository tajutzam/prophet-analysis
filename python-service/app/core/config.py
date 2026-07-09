from pydantic_settings import BaseSettings
from functools import lru_cache
import os

class Settings(BaseSettings):
    APP_NAME: str = "Laundry Prophet AI Service"
    APP_ENV: str = "development"
    DEBUG: bool = True
    
    # Paths
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    DATA_DIR: str = "datasets"
    MODEL_DIR: str = "models"
    EXPORT_DIR: str = "exports"
    
    # Model Config
    DEFAULT_FORECAST_PERIOD: int = 30
    MODEL_FILENAME: str = "prophet_laundry_model.pkl"
    
    # API Config
    HOST: str = "127.0.0.1"
    PORT: int = 8088
    
    @property
    def model_path(self) -> str:
        return os.path.join(self.MODEL_DIR, self.MODEL_FILENAME)

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()
