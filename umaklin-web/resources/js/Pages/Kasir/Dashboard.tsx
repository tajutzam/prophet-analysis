import SidebarLayout from '@/Layouts/SidebarLayout';
import { Head, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush, PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { 
    ChevronDown, ArrowUpRight, ArrowDownRight, AlertCircle, Calendar, Table as TableIcon, TrendingUp
} from 'lucide-react';
import { useMemo, useState } from 'react';

interface DashboardProps extends PageProps {
    stats: { 
        total_transactions_today: number; 
        total_revenue_month: number; 
        total_customers: number; 
        pending_orders: number; 
        retention_rate: number;
    };
    forecast: any | null;
    timeSeries: any[] | null;
    inventory: { total_transactions: string; service_distribution: any[]; stok_status: any[]; message: string; } | null;
    crm: { retention_rate: number; region_distribution: any[]; retention_data: any[]; message: string; } | null;
    forecastError: string | null;
    timeSeriesError: string | null;
}

const COLORS = ['#10B981', '#3B82F6', '#6366F1', '#F59E0B', '#EC4899'];

const PERIOD_LABELS: Record<string, string> = { '1D': 'Harian', '1W': 'Mingguan', '1M': 'Bulanan', '1Y': 'Tahunan' };

export default function Dashboard({ stats, timeSeries, inventory, crm, forecastError, timeSeriesError }: DashboardProps) {
    const [horizon, setHorizon] = useState('1W');
    const [servicePeriod, setServicePeriod] = useState('1M');
    const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
    const [showTable, setShowTable] = useState(false);
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
    };

    const filteredData = useMemo(() => {
        if (!timeSeries) return [];
        const countMap: Record<string, number> = { '1D': 1, '3D': 3, '1W': 7, '2W': 14, '1M': 30, '3M': 90, '6M': 180, '1Y': 365, '3Y': 1095 };
        const days = countMap[horizon] || 7;
        return timeSeries.slice(0, days);
    }, [timeSeries, horizon]);

    const projectedStats = useMemo(() => {
        if (!filteredData || filteredData.length === 0) return { total: 0, growth: 0 };
        const total = filteredData.reduce((acc, curr) => acc + (curr.predicted_revenue || 0), 0);
        const growth = stats.total_revenue_month > 0 ? ((total - stats.total_revenue_month) / stats.total_revenue_month) * 100 : 0;
        return { total, growth };
    }, [filteredData, stats.total_revenue_month]);

    const handlePeriodChange = (period: string) => {
        setServicePeriod(period);
        setShowPeriodDropdown(false);
        router.reload({ data: { service_period: period }, only: ['inventory'] });
    };

    return (
        <SidebarLayout header="Dasbor Analitik">
            <Head title="Dasbor Analitik" />

            <div className="min-h-screen bg-[#F9FAFB] -m-8 p-8 relative">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Ringkasan Operasional</h1>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setShowTable(!showTable)} 
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center gap-2 ${showTable ? 'bg-emerald-600 text-white' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'}`}
                        >
                            <TableIcon className="w-4 h-4" />
                            {showTable ? 'Tutup Tabel' : 'Lihat Tabel Prediksi'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {[
                        { label: 'Pesanan Hari Ini', value: stats.total_transactions_today, trend: '+2%', color: 'text-blue-500', desc: 'transaksi hari ini' },
                        { label: 'Pendapatan Bulan Ini', value: formatCurrency(stats.total_revenue_month), trend: '+8%', color: 'text-emerald-500', desc: 'vs bulan lalu' },
                        { label: 'Database Pelanggan', value: stats.total_customers, trend: 'Aktif', color: 'text-slate-500', desc: 'member terdaftar' },
                        { label: 'Loyalitas Pelanggan', value: `${stats.retention_rate}%`, trend: 'Rata-rata', color: 'text-indigo-600', desc: 'tingkat retensi' },
                    ].map((m, idx) => (
                        <div key={idx} className={`bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group transition-all hover:border-${idx === 0 ? 'blue' : idx === 1 ? 'emerald' : idx === 3 ? 'indigo' : 'slate'}-200`}>
                            <div className="flex justify-between items-start mb-4">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{m.label}</p>
                                {idx === 3 ? (
                                    <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600"><TrendingUp className="w-3.5 h-3.5" /></div>
                                ) : (
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${idx === 2 ? 'bg-slate-100 text-slate-600' : idx === 0 ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>{m.trend}</span>
                                )}
                            </div>
                            <div className="flex items-end justify-between">
                                <h3 className={`text-2xl font-black tracking-tighter ${idx === 3 ? 'text-indigo-600' : idx === 1 ? 'text-emerald-600' : idx === 0 ? 'text-blue-600' : 'text-slate-900'}`}>{m.value}</h3>
                                <p className="text-[9px] font-bold text-slate-400 uppercase">{m.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {showTable && timeSeries && (
                    <div className="mb-10 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Rincian Proyeksi Harian</h3>
                                <p className="text-xs text-slate-500 font-medium mt-1">Data estimasi pesanan dan pendapatan untuk 7 hari ke depan.</p>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-white text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                        <th className="px-8 py-5">Tanggal</th>
                                        <th className="px-8 py-5">Estimasi Pesanan</th>
                                        <th className="px-8 py-5">Estimasi KG</th>
                                        <th className="px-8 py-5">Proyeksi Pendapatan</th>
                                        <th className="px-8 py-5">Batas Bawah</th>
                                        <th className="px-8 py-5">Batas Atas</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {timeSeries.slice(0, 7).map((row, i) => (
                                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-4 text-sm font-bold text-slate-900">
                                                {new Date(row.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
                                            </td>
                                            <td className="px-8 py-4 text-sm font-black text-emerald-600">{Math.round(row.predicted_orders)} Order</td>
                                            <td className="px-8 py-4 text-sm font-black text-blue-600">{row.predicted_weight !== undefined ? row.predicted_weight.toFixed(1) : '0.0'} kg</td>
                                            <td className="px-8 py-4 text-sm font-black text-slate-900">{formatCurrency(row.predicted_revenue)}</td>
                                            <td className="px-8 py-4 text-xs font-bold text-slate-400">{Math.floor(row.lower_bound)}</td>
                                            <td className="px-8 py-4 text-xs font-bold text-slate-400">{Math.ceil(row.upper_bound)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm transition-all duration-500 order-1">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Jenis Layanan</h3>
                            <div className="relative">
                                <button onClick={() => setShowPeriodDropdown(!showPeriodDropdown)} className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black text-emerald-600 uppercase tracking-wider hover:bg-white transition-all shadow-sm"><Calendar className="w-3 h-3" /> {PERIOD_LABELS[servicePeriod]} <ChevronDown className={`w-3 h-3 transition-transform ${showPeriodDropdown ? 'rotate-180' : ''}`} /></button>
                                {showPeriodDropdown && (<div className="absolute right-0 mt-2 w-36 bg-white border border-slate-100 rounded-2xl shadow-xl z-10 overflow-hidden animate-in fade-in zoom-in duration-200">{Object.entries(PERIOD_LABELS).map(([key, label]) => (<button key={key} onClick={() => handlePeriodChange(key)} className={`w-full text-left px-5 py-3 text-[11px] font-bold transition-all hover:bg-slate-50 ${servicePeriod === key ? 'text-emerald-600 bg-emerald-50/50' : 'text-slate-500'}`}>{label}</button>))}</div>)}
                            </div>
                        </div>
                        <div className="h-[240px] w-full relative mb-8">
                            <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={inventory?.service_distribution || []} innerRadius={75} outerRadius={95} paddingAngle={8} dataKey="value">{(inventory?.service_distribution || []).map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}</Pie></PieChart></ResponsiveContainer>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center"><p className="text-2xl font-black text-slate-900 tracking-tighter">{inventory?.total_transactions || '0'}</p><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Transaksi</p></div>
                        </div>
                        <div className="space-y-4">
                            {(inventory?.service_distribution || []).map((item, idx) => (<div key={idx} className="flex items-center justify-between text-[11px]"><div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div><p className="font-bold text-slate-600">{item.name}</p></div><div className="flex items-center gap-4"><p className="font-black text-slate-900">{item.avg_price}</p><span className={`font-black ${item.trend.startsWith('-') ? 'text-rose-500' : 'text-emerald-500'}`}>{item.trend}</span></div></div>))}
                        </div>
                    </div>

                    <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm order-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-6">
                            <div><h3 className="text-lg font-bold text-slate-900 tracking-tight mb-2">Proyeksi Pendapatan</h3><div className="flex items-baseline gap-3"><h3 className="text-3xl font-black text-slate-900 tracking-tighter">{formatCurrency(projectedStats.total)}</h3><span className={`text-xs font-bold flex items-center gap-1 ${projectedStats.growth >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{projectedStats.growth >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />} {Math.abs(Math.round(projectedStats.growth))}% vs bulan lalu</span></div></div>
                            <div className="flex bg-slate-100/80 p-1 rounded-xl">{['1D', '1W', '1M', '3M', '1Y', '3Y'].map((t) => (<button key={t} onClick={() => setHorizon(t)} className={`px-4 py-1.5 text-[11px] font-black rounded-lg transition-all ${horizon === t ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{t}</button>))}</div>
                        </div>
                        <div className="h-[320px] w-full flex items-center justify-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                            {timeSeries && filteredData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%"><AreaChart data={filteredData}><defs><linearGradient id="colorMint" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/><stop offset="95%" stopColor="#10B981" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" /><XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 700 }} tickFormatter={(val) => new Date(val).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} /><YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 700 }} /><Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }} labelFormatter={(label) => new Date(label).toLocaleDateString('id-ID', { dateStyle: 'full' })} formatter={(value, name) => name === 'predicted_orders' ? [`${Math.round(Number(value))} order`, 'Estimasi Order'] : [value, name]} /><Area type="monotone" dataKey="predicted_orders" stroke="#10B981" strokeWidth={4} fillOpacity={1} fill="url(#colorMint)" animationDuration={2000} /><Brush dataKey="date" height={35} stroke="#E2E8F0" fill="#F8FAFB" /></AreaChart></ResponsiveContainer>
                            ) : timeSeriesError ? (
                                <div className="text-center space-y-3 max-w-md px-6">
                                    <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center mx-auto">
                                        <AlertCircle className="w-6 h-6 text-rose-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">Proyeksi belum bisa dimuat</p>
                                        <p className="text-[10px] font-medium text-slate-400 mt-1">
                                            {timeSeriesError}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center space-y-4">
                                    <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin mx-auto"></div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">Menyiapkan Proyeksi Bisnis</p>
                                        <p className="text-[10px] font-medium text-slate-400">AI sedang menganalisis data transaksi historis Anda...</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
