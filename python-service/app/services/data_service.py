import pandas as pd
import numpy as np
import os
import glob
from app.core.logger import logger

class DataService:
    def __init__(self):
        self.cached_df = pd.DataFrame()
        self.dataset_dir = 'datasets'

    def set_data(self, data: list):
        """Sets data from external source (Laravel payload)"""
        if not data:
            self.cached_df = pd.DataFrame()
            return
        self.cached_df = pd.DataFrame(data)

    def load_real_datasets(self) -> pd.DataFrame:
        """
        Loads all Excel files using logic matched from 
        notebooks/prophet_laundry_analysis.ipynb (Tahap 2 & 3)
        """
        all_files = glob.glob(os.path.join(self.dataset_dir, "**/*.xlsx"), recursive=True)
        # Filter out temp files
        all_files = [f for f in all_files if not os.path.basename(f).startswith('~$')]
        
        if not all_files:
            logger.warning("No real datasets found.")
            return pd.DataFrame()

        buffer_frames = []
        target_sheet = "Laporan Transaksi laundry"
        
        mapping_kolom = {
            'Kode Trx': 'No. Transaksi',
            'Tgl. Trx': 'ds',  # Prophet format
            'Jasa': 'service_name',
            'Harga': 'price_per_unit',
            'Grandtotal': 'y', # Prophet target (Total Bayar)
            'Pelanggan': 'user_id',
            'Kiloan': 'weight_kg',
            'Satuan': 'weight_unit'
        }

        for file in sorted(all_files):
            try:
                # Use header=1 as per notebook (actual headers are on 2nd row)
                df_temp = pd.read_excel(file, sheet_name=target_sheet, header=1)
                
                # Rename columns
                df_temp = df_temp.rename(columns=mapping_kolom)
                
                # Handle weight logic (Kiloan or Satuan)
                if 'weight_kg' in df_temp.columns and 'weight_unit' in df_temp.columns:
                    df_temp['total_weight'] = df_temp['weight_kg'].fillna(df_temp['weight_unit'])
                elif 'weight_kg' in df_temp.columns:
                    df_temp['total_weight'] = df_temp['weight_kg']
                else:
                    df_temp['total_weight'] = 1.0
                
                buffer_frames.append(df_temp)
                logger.info(f"Successfully loaded real data from {os.path.basename(file)}")
            except Exception as e:
                logger.error(f"Failed to load {file}: {e}")

        if not buffer_frames: return pd.DataFrame()
        
        df_master = pd.concat(buffer_frames, ignore_index=True)
        
        # Data Cleaning as per Notebook (Tahap 3)
        # 1. Normalize Date
        df_master['ds'] = pd.to_datetime(df_master['ds'], dayfirst=True, errors='coerce')
        df_master = df_master.dropna(subset=['ds'])
        
        # 2. Remove Duplicates
        if 'No. Transaksi' in df_master.columns:
            df_master = df_master.drop_duplicates(subset=['No. Transaksi'])
            
        # 3. Numeric Cleanup
        df_master['y'] = pd.to_numeric(df_master['y'], errors='coerce').fillna(0)
        df_master['total_weight'] = pd.to_numeric(df_master['total_weight'], errors='coerce').fillna(1.0)
        
        return df_master

    def load_and_merge(self) -> pd.DataFrame:
        """Merges file data with Laravel dynamic data."""
        real_df = self.load_real_datasets()
        
        if not self.cached_df.empty:
            # Map Laravel payload fields to match real_df
            # Laravel uses: date, total_price, service_name, etc.
            lar_df = self.cached_df.copy()
            lar_map = {
                'date': 'ds',
                'total_price': 'y',
                'total_weight': 'total_weight'
            }
            lar_df = lar_df.rename(columns=lar_map)
            lar_df['ds'] = pd.to_datetime(lar_df['ds'])
            
            if not real_df.empty:
                final_df = pd.concat([real_df, lar_df], ignore_index=True)
            else:
                final_df = lar_df
        else:
            final_df = real_df
            
        # Final Sort
        if not final_df.empty:
            final_df = final_df.sort_values(by='ds').reset_index(drop=True)
            
        return final_df

    def load_and_merge_excel(self) -> pd.DataFrame:
        """Backward-compatible alias used by older route handlers."""
        return self.load_and_merge()

    def clean_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Normalizes the dataframe into the standard Prophet-ready shape."""
        if df.empty:
            return pd.DataFrame(columns=['ds', 'y'])

        cleaned = df.copy()

        if 'ds' not in cleaned.columns and 'date' in cleaned.columns:
            cleaned = cleaned.rename(columns={'date': 'ds'})

        if 'y' not in cleaned.columns and 'total_price' in cleaned.columns:
            cleaned = cleaned.rename(columns={'total_price': 'y'})

        cleaned['ds'] = pd.to_datetime(cleaned['ds'], errors='coerce', dayfirst=True)
        cleaned = cleaned.dropna(subset=['ds'])

        if 'y' in cleaned.columns:
            cleaned['y'] = pd.to_numeric(cleaned['y'], errors='coerce').fillna(0)
        else:
            cleaned['y'] = 0

        if 'No. Transaksi' in cleaned.columns:
            cleaned = cleaned.drop_duplicates(subset=['No. Transaksi'])
        elif 'receipt_number' in cleaned.columns:
            cleaned = cleaned.drop_duplicates(subset=['receipt_number'])

        return cleaned.sort_values(by='ds').reset_index(drop=True)

    def transform_to_timeseries(self, df: pd.DataFrame) -> pd.DataFrame:
        """Aggregates for Prophet (Daily count of orders)"""
        if df.empty: return pd.DataFrame(columns=['ds', 'y'])
        
        # We want to predict order counts
        ts_df = df.groupby(df['ds'].dt.date).size().reset_index()
        ts_df.columns = ['ds', 'y']
        ts_df['ds'] = pd.to_datetime(ts_df['ds'])
        return ts_df

data_service = DataService()
