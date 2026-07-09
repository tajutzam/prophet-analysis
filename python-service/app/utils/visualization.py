import matplotlib.pyplot as plt
import io
import base64
import os
from app.core.config import settings

class VisualizationUtil:
    @staticmethod
    def plot_to_base64(fig):
        """Converts matplotlib figure to base64 string."""
        buf = io.BytesIO()
        fig.savefig(buf, format='png', bbox_inches='tight')
        buf.seek(0)
        img_str = base64.b64encode(buf.read()).decode('utf-8')
        plt.close(fig)
        return img_str

    @staticmethod
    def create_forecast_plot(df, forecast):
        """Creates a forecast plot using matplotlib."""
        fig, ax = plt.subplots(figsize=(12, 6))
        
        # Plot historical data
        ax.plot(df['ds'], df['y'], 'k.', label='Data Historis')
        
        # Plot forecast
        ax.plot(forecast['ds'], forecast['yhat'], ls='-', c='#0072B2', label='Prediksi')
        ax.fill_between(forecast['ds'], forecast['yhat_lower'], forecast['yhat_upper'], 
                        color='#0072B2', alpha=0.2, label='Interval Kepercayaan (95%)')
        
        ax.set_title('Laundry Order Forecasting')
        ax.set_xlabel('Tanggal')
        ax.set_ylabel('Jumlah Order')
        ax.legend()
        ax.grid(True, alpha=0.3)
        
        return fig

    @staticmethod
    def save_plot(fig, filename):
        """Saves plot to exports directory."""
        os.makedirs(settings.EXPORT_DIR, exist_ok=True)
        path = os.path.join(settings.EXPORT_DIR, filename)
        fig.savefig(path)
        return path
