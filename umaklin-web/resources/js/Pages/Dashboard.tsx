import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { ShoppingBag, Users, TrendingUp, Clock } from 'lucide-react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-black tracking-tighter text-slate-900">
                            Dashboard
                        </h2>
                        <p className="text-sm font-medium text-slate-500 mt-1">Selamat datang kembali di panel kendali Umaklin.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="px-4 py-2 bg-white border border-blue-100 text-blue-600 rounded-xl text-sm font-bold shadow-sm hover:bg-blue-50 transition-all">
                            Unduh Laporan
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
                            Pesanan Baru
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'Total Pesanan', value: '1,284', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12.5%' },
                        { label: 'Pelanggan Baru', value: '48', icon: Users, color: 'text-amber-600', bg: 'bg-amber-50', trend: '+5.2%' },
                        { label: 'Pendapatan', value: 'Rp 4.2M', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+18.2%' },
                        { label: 'Proses Cuci', value: '24', icon: Clock, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: 'Sedang Berjalan' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-3xl border border-blue-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.trend}</span>
                            </div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-tight">{stat.label}</p>
                            <h3 className="text-3xl font-black text-slate-900 mt-1">{stat.value}</h3>
                        </div>
                    ))}
                </div>

                {/* Content Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white rounded-[32px] border border-blue-50 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-blue-50 flex items-center justify-between">
                            <h3 className="text-xl font-black text-slate-900">Pesanan Terbaru</h3>
                            <button className="text-sm font-bold text-blue-600 hover:underline">Lihat Semua</button>
                        </div>
                        <div className="p-8 text-center py-20">
                            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShoppingBag className="w-10 h-10 text-blue-200" />
                            </div>
                            <h4 className="text-lg font-bold text-slate-900">Belum Ada Pesanan Aktif</h4>
                            <p className="text-slate-400 max-w-xs mx-auto mt-2">Semua pesanan Anda akan muncul di sini secara real-time.</p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl shadow-blue-200">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                        <div className="relative z-10">
                            <h3 className="text-xl font-black mb-4">Umaklin Pro</h3>
                            <p className="text-blue-100 text-sm leading-relaxed mb-8">
                                Optimalkan bisnis laundry Anda dengan fitur analisis prediktif AI dan manajemen inventaris otomatis.
                            </p>
                            <button className="w-full py-4 bg-amber-400 text-blue-950 rounded-2xl font-black hover:bg-amber-300 transition-all shadow-lg">
                                Upgrade Sekarang
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
