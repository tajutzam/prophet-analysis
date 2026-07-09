import SidebarLayout from '@/Layouts/SidebarLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { 
    Search, Filter, ShoppingBag, 
    ChevronRight, ArrowRight, Package
} from 'lucide-react';
import { useState } from 'react';

interface Transaction {
    id: number;
    receipt_number: string;
    total_weight: string | null;
    total_price: string | null;
    status: 'pending' | 'washing' | 'ironing' | 'done' | 'delivered';
    date: string;
}

interface OrdersProps extends PageProps {
    transactions: Transaction[];
}

export default function Orders({ transactions }: OrdersProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const formatCurrency = (amount: string | null) => {
        if (!amount) return 'Rp0';
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(amount));
    };

    const getStatusStyles = (status: Transaction['status']) => {
        const styles = {
            pending: { label: 'Diterima', style: 'text-amber-600 bg-amber-50' },
            washing: { label: 'Proses Cuci', style: 'text-blue-600 bg-blue-50' },
            ironing: { label: 'Proses Setrika', style: 'text-indigo-600 bg-indigo-50' },
            done: { label: 'Selesai', style: 'text-emerald-600 bg-emerald-50' },
            delivered: { label: 'Sudah Diambil', style: 'text-slate-500 bg-slate-50' },
        };
        return styles[status] || styles.pending;
    };

    const filteredTransactions = transactions.filter(trx => {
        const matchesSearch = trx.receipt_number.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || trx.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <SidebarLayout header="Pesanan Saya">
            <Head title="Pesanan Saya" />

            <div className="space-y-6">
                {/* Search & Filter Bar */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Cari nomor resi..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
                        <span className="text-xs font-bold text-slate-400 mr-2 uppercase tracking-wider">Filter:</span>
                        {['all', 'pending', 'washing', 'ironing', 'done', 'delivered'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all whitespace-nowrap ${
                                    filterStatus === status 
                                    ? 'bg-indigo-600 text-white shadow-sm' 
                                    : 'text-slate-500 hover:bg-slate-100'
                                }`}
                            >
                                {status === 'all' ? 'Semua' : status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Orders List */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                                    <th className="px-6 py-4">Nomor Resi</th>
                                    <th className="px-6 py-4">Tanggal</th>
                                    <th className="px-6 py-4">Total Biaya</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredTransactions.length > 0 ? filteredTransactions.map((trx) => (
                                    <tr key={trx.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                                                    <Package className="w-4 h-4" />
                                                </div>
                                                <span className="text-sm font-bold text-slate-900">#{trx.receipt_number}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {new Date(trx.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-slate-900">
                                            {formatCurrency(trx.total_price)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${getStatusStyles(trx.status)}`}>
                                                {trx.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link 
                                                href={route('pelanggan.orders.show', trx.id)}
                                                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                                            >
                                                Detail
                                                <ChevronRight className="w-3 h-3" />
                                            </Link>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center justify-center text-slate-400">
                                                <ShoppingBag className="w-12 h-12 mb-4 opacity-20" />
                                                <p className="text-sm font-medium">Tidak ada pesanan yang ditemukan.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
