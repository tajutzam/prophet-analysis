import SidebarLayout from '@/Layouts/SidebarLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    Clock, CheckCircle2, ShoppingBag,
    ChevronRight, ArrowRight, Plus
} from 'lucide-react';

interface Transaction {
    id: number;
    receipt_number: string;
    total_weight: string | null;
    total_price: string | null;
    status: 'pending' | 'washing' | 'ironing' | 'done' | 'delivered';
    date: string;
}

interface DashboardProps extends PageProps {
    recent_transactions: Transaction[];
    stats: {
        total_orders: number;
        total_spending: string;
        points: number;
    };
}

export default function Dashboard({ auth, recent_transactions, stats }: DashboardProps) {
    const formatCurrency = (amount: string | null) => {
        if (!amount) return 'Rp0';
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(amount));
    };

    const getStatusLabel = (status: Transaction['status']) => {
        const labels = {
            pending: { text: 'Diterima', color: 'text-amber-600 bg-amber-50' },
            washing: { text: 'Proses Cuci', color: 'text-blue-600 bg-blue-50' },
            ironing: { text: 'Proses Setrika', color: 'text-indigo-600 bg-indigo-50' },
            done: { text: 'Selesai', color: 'text-emerald-600 bg-emerald-50' },
            delivered: { text: 'Sudah Diambil', color: 'text-slate-500 bg-slate-50' },
        };
        const label = labels[status] || labels.pending;
        return (
            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${label.color}`}>
                {label.text}
            </span>
        );
    };

    return (
        <SidebarLayout header="Dashboard">
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* Welcome & Action */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Halo, {auth.user.name}!</h2>
                        <p className="text-sm text-slate-500 mt-1">Selamat datang di panel pelanggan Umaklin.</p>
                    </div>
                    <Link
                        href={route('pelanggan.orders.create')}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Buat Pesanan Baru
                    </Link>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Total Pesanan</p>
                        <h3 className="text-2xl font-bold text-slate-900">{stats.total_orders}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-slate-200">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Total Pengeluaran</p>
                        <h3 className="text-2xl font-bold text-slate-900">{formatCurrency(stats.total_spending)}</h3>
                    </div>
                </div>

                {/* Recent Orders List */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="font-bold text-slate-900">Pesanan Terakhir</h3>
                        <Link href={route('pelanggan.orders')} className="text-xs font-bold text-indigo-600 hover:underline">Lihat Semua</Link>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {recent_transactions.length > 0 ? recent_transactions.map((trx) => (
                            <Link
                                key={trx.id}
                                href={route('pelanggan.orders.show', trx.id)}
                                className="flex items-center justify-between p-6 hover:bg-slate-50 transition-colors group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                                        <ShoppingBag className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">#{trx.receipt_number}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">{new Date(trx.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="hidden sm:block text-right">
                                        <p className="text-sm font-bold text-slate-900">{formatCurrency(trx.total_price)}</p>
                                        {getStatusLabel(trx.status)}
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                                </div>
                            </Link>
                        )) : (
                            <div className="p-12 text-center">
                                <p className="text-sm text-slate-400">Belum ada pesanan.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* AI Tip (Simplified) */}
                <div className="bg-indigo-600 p-6 rounded-xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-bold">Tips Cerdas Umaklin</p>
                            <p className="text-xs text-indigo-100 mt-1">Minggu depan diprediksi akan ramai. Pesan sekarang untuk pengerjaan lebih cepat!</p>
                        </div>
                    </div>
                    <button className="px-4 py-2 bg-slate-100 text-slate-800 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors">
                        Pelajari Selengkapnya
                    </button>
                </div>
            </div>
        </SidebarLayout>
    );
}
