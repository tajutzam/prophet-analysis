import SidebarLayout from '@/Layouts/SidebarLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    Search,
    Plus,
    Eye,
    Edit2,
    X,
    ArrowUpDown,
    ArrowUp,
    ArrowDown
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface LaundryService {
    id: number;
    name: string;
    price_per_kg: number;
}

interface User {
    id: number;
    name: string;
}

interface Transaction {
    id: number;
    receipt_number: string;
    user_id: number;
    service_id: number | null;
    total_price: number;
    total_weight: number;
    status: 'pending' | 'washing' | 'ironing' | 'done' | 'delivered';
    payment_status: 'paid' | 'unpaid';
    payment_method: string;
    date: string;
    created_at: string;
    user: {
        name: string;
        email: string;
    };
}

interface TransactionsProps extends PageProps {
    transactions: {
        data: Transaction[];
        links: any[];
        current_page: number;
        last_page: number;
        total: number;
        from?: number;
        to?: number;
    };
    users: User[];
    services: LaundryService[];
    filters: {
        sort?: string;
        direction?: 'asc' | 'desc';
        search?: string;
        status?: string;
    };
}

export default function Index({ transactions, users, services, filters }: TransactionsProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

    // Filter Logic
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search !== (filters.search || '')) {
                handleFilterChange();
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const handleFilterChange = (newStatus?: string) => {
        router.get(route('kasir.transactions.index'), {
            ...filters,
            search: search,
            status: newStatus !== undefined ? newStatus : statusFilter,
            page: 1 // Reset to page 1 on filter change
        }, {
            preserveState: true,
            replace: true
        });
    };

    const handleStatusChange = (status: string) => {
        setStatusFilter(status);
        handleFilterChange(status);
    };

    const handleSort = (column: string) => {
        const direction = filters.sort === column && filters.direction === 'asc' ? 'desc' : 'asc';
        router.get(route('kasir.transactions.index'), {
            ...filters,
            sort: column,
            direction
        }, { preserveState: true });
    };

    const SortIcon = ({ column }: { column: string }) => {
        if (filters.sort !== column) return <ArrowUpDown className="w-3 h-3 ml-1 text-slate-300" />;
        return filters.direction === 'asc'
            ? <ArrowUp className="w-3 h-3 ml-1 text-indigo-600" />
            : <ArrowDown className="w-3 h-3 ml-1 text-indigo-600" />;
    };

    const { data, setData, put, processing, errors, reset } = useForm({
        user_id: '',
        service_id: '',
        total_weight: '',
        total_price: '',
        status: '',
        payment_status: '',
        payment_method: '',
        date: '',
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'washing': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'ironing': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
            case 'done': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'delivered': return 'bg-slate-50 text-slate-600 border-slate-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    const openEditModal = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setData({
            user_id: transaction.user_id.toString(),
            service_id: (transaction.service_id || '').toString(),
            total_weight: transaction.total_weight.toString(),
            total_price: transaction.total_price.toString(),
            status: transaction.status,
            payment_status: transaction.payment_status,
            payment_method: transaction.payment_method,
            date: transaction.date,
        });
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingTransaction(null);
        reset();
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingTransaction) {
            put(route('kasir.transactions.update', editingTransaction.id), {
                onSuccess: () => closeEditModal(),
            });
        }
    };

    // Auto-calculate price when weight or service changes
    useEffect(() => {
        const service = services.find(s => s.id.toString() === data.service_id);
        if (service && data.total_weight) {
            const price = service.price_per_kg * parseFloat(data.total_weight);
            setData('total_price', price.toString());
        }
    }, [data.service_id, data.total_weight]);

    return (
        <SidebarLayout header="Daftar Transaksi">
            <Head title="Riwayat Transaksi" />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Transaksi Laundry</h1>
                        <p className="text-slate-500 text-sm">Kelola aktivitas laundry secara real-time.</p>
                    </div>
                    <Link
                        href={route('kasir.transactions.create')}
                        className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                        Transaksi Baru
                    </Link>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 group w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari No. Resi atau Nama Pelanggan..."
                            className="w-full pl-11 pr-11 py-2 bg-slate-50 border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 transition-all font-medium text-slate-700"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        {search && (
                            <button
                                onClick={() => { setSearch(''); handleFilterChange(); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
                        <span className="text-xs font-bold text-slate-400 mr-2 uppercase tracking-wider whitespace-nowrap">Filter:</span>
                        {['all', 'pending', 'washing', 'ironing', 'done', 'delivered'].map((status) => (
                            <button
                                key={status}
                                onClick={() => handleStatusChange(status)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all whitespace-nowrap ${
                                    statusFilter === status
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                                }`}
                            >
                                {status === 'all' ? 'Semua' : status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th
                                        className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50 transition-colors"
                                        onClick={() => handleSort('receipt_number')}
                                    >
                                        <div className="flex items-center">
                                            No. Resi <SortIcon column="receipt_number" />
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        Pelanggan
                                    </th>
                                    <th
                                        className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50 transition-colors"
                                        onClick={() => handleSort('total_weight')}
                                    >
                                        <div className="flex items-center">
                                            Berat <SortIcon column="total_weight" />
                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50 transition-colors"
                                        onClick={() => handleSort('total_price')}
                                    >
                                        <div className="flex items-center">
                                            Total <SortIcon column="total_price" />
                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50 transition-colors"
                                        onClick={() => handleSort('status')}
                                    >
                                        <div className="flex items-center">
                                            Status <SortIcon column="status" />
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        Bayar
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {transactions.data.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-900">#{item.receipt_number}</span>
                                                <span className="text-[10px] text-slate-400 font-medium">
                                                    {new Date(item.created_at).toLocaleDateString('id-ID')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-600 border border-indigo-100">
                                                    {item.user.name.charAt(0)}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-sm font-bold text-slate-700 truncate">{item.user.name}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs text-slate-600 font-bold">{item.total_weight} Kg</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold text-slate-900">{formatCurrency(item.total_price)}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${getStatusColor(item.status)}`}>
                                                {item.status}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] font-bold uppercase tracking-wider ${item.payment_status === 'paid' ? 'text-emerald-600' : 'text-rose-500'}`}>
                                                {item.payment_status === 'paid' ? 'Lunas' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    href={route('kasir.transactions.show', item.id)}
                                                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all flex flex-col items-center gap-1 min-w-[48px]"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    <span className="text-[9px] font-bold tracking-tight">Detail</span>
                                                </Link>
                                                <button
                                                    onClick={() => openEditModal(item)}
                                                    className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all flex flex-col items-center gap-1 min-w-[48px]"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                    <span className="text-[9px] font-bold tracking-tight">Edit</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {transactions.links && transactions.links.length > 3 && (
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-xs font-semibold text-slate-500">
                            Menampilkan <span className="font-bold text-slate-700">{transactions.from || 0}</span> sampai <span className="font-bold text-slate-700">{transactions.to || 0}</span> dari <span className="font-bold text-slate-700">{transactions.total}</span> transaksi
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 justify-center">
                            {transactions.links.map((link, idx) => {
                                let label = link.label;
                                if (label.includes('Previous')) {
                                    label = 'Sebelumnya';
                                } else if (label.includes('Next')) {
                                    label = 'Berikutnya';
                                }

                                return link.url === null ? (
                                    <div
                                        key={idx}
                                        className="px-3.5 py-2 text-xs font-bold text-slate-300 bg-slate-50 border border-slate-100 rounded-xl cursor-default"
                                        dangerouslySetInnerHTML={{ __html: label }}
                                    />
                                ) : (
                                    <Link
                                        key={idx}
                                        href={link.url}
                                        className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition-all ${
                                            link.active
                                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: label }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Edit Modal Simplified */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeEditModal}></div>
                    <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-bold text-slate-900">Edit Transaksi #{editingTransaction?.receipt_number}</h2>
                                <button onClick={closeEditModal} className="p-2 hover:bg-slate-50 rounded-full transition-all text-slate-400">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status Pengerjaan</label>
                                        <select
                                            className="w-full bg-slate-50 border-slate-100 rounded-xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-indigo-100"
                                            value={data.status}
                                            onChange={e => setData('status', e.target.value as any)}
                                        >
                                            <option value="pending">Diterima</option>
                                            <option value="washing">Cuci</option>
                                            <option value="ironing">Setrika</option>
                                            <option value="done">Selesai</option>
                                            <option value="delivered">Diambil</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pembayaran</label>
                                        <select
                                            className="w-full bg-slate-50 border-slate-100 rounded-xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-indigo-100"
                                            value={data.payment_status}
                                            onChange={e => setData('payment_status', e.target.value as any)}
                                        >
                                            <option value="unpaid">Belum Bayar</option>
                                            <option value="paid">Lunas</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Berat (Kg)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        className="w-full bg-slate-50 border-slate-100 rounded-xl px-4 py-2 text-sm font-bold"
                                        value={data.total_weight}
                                        onChange={e => setData('total_weight', e.target.value)}
                                    />
                                </div>

                                <div className="bg-indigo-50 p-4 rounded-xl">
                                    <p className="text-[10px] font-bold text-indigo-600 uppercase">Total Harga</p>
                                    <p className="text-xl font-bold text-indigo-900">{formatCurrency(parseFloat(data.total_price) || 0)}</p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </SidebarLayout>
    );
}
