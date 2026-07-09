import SidebarLayout from '@/Layouts/SidebarLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { 
    Plus, 
    Search, 
    User as UserIcon, 
    Phone, 
    Mail, 
    MapPin, 
    Edit2, 
    Trash2, 
    X,
    ChevronRight,
    UserPlus,
    TrendingUp,
    Users
} from 'lucide-react';
import { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
    created_at: string;
}

interface CustomersProps extends PageProps {
    customers: {
        data: Customer[];
        links: any[];
        current_page: number;
        last_page: number;
        total: number;
    };
    filters: {
        search?: string;
    };
    stats: {
        total_customers: number;
        retention_rate: number;
    };
}

export default function Index({ customers, filters, stats }: CustomersProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [search, setSearch] = useState(filters.search || '');

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        address: '',
    });

    // Search Logic
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search !== (filters.search || '')) {
                router.get(route('kasir.customers.index'), { search }, {
                    preserveState: true,
                    replace: true
                });
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const openCreateModal = () => {
        setEditingCustomer(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (customer: Customer) => {
        setEditingCustomer(customer);
        setData({
            name: customer.name,
            email: customer.email,
            phone: customer.phone || '',
            address: customer.address || '',
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCustomer(null);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCustomer) {
            put(route('kasir.customers.update', editingCustomer.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('kasir.customers.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus pelanggan ini?')) {
            destroy(route('kasir.customers.destroy', id));
        }
    };

    return (
        <SidebarLayout header="Pelanggan">
            <Head title="Manajemen Pelanggan" />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Database Pelanggan</h1>
                        <p className="text-slate-500 text-sm">Kelola data dan riwayat kontak pelanggan.</p>
                    </div>
                    <button 
                        onClick={openCreateModal}
                        className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md active:scale-95"
                    >
                        <UserPlus className="w-4 h-4" />
                        Tambah Pelanggan
                    </button>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-5">
                        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Pelanggan</p>
                            <h3 className="text-2xl font-bold text-slate-900">{stats.total_customers}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-5">
                        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Loyalitas Pelanggan</p>
                                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold">Rata-rata Retensi</span>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900">{stats.retention_rate}%</h3>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Cari pelanggan berdasarkan nama atau email..."
                            className="w-full pl-11 pr-11 py-2 bg-slate-50 border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-100 transition-all text-slate-700"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        {search && (
                            <button 
                                onClick={() => setSearch('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Customers Table */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-200">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Pelanggan</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Kontak</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Alamat</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {customers.data.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-slate-50/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center text-sm font-bold text-indigo-600 border border-indigo-100">
                                                    {customer.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <Link href={route('kasir.customers.show', customer.id)} className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors">{customer.name}</Link>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase">ID: {customer.id.toString().padStart(4, '0')}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-xs text-slate-600 font-bold">
                                                    <Mail className="w-3 h-3 text-slate-400" />
                                                    {customer.email}
                                                </div>
                                                {customer.phone && (
                                                    <div className="flex items-center gap-2 text-xs text-slate-600 font-bold">
                                                        <Phone className="w-3 h-3 text-slate-400" />
                                                        {customer.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-start gap-2 text-xs text-slate-500 max-w-[200px] truncate font-bold">
                                                <MapPin className="w-3 h-3 mt-0.5 shrink-0 text-slate-400" />
                                                {customer.address || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                <button 
                                                    onClick={() => openEditModal(customer)}
                                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(customer.id)}
                                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Form Simplified */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeModal}></div>
                    <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-bold text-slate-900">
                                    {editingCustomer ? 'Edit Pelanggan' : 'Pelanggan Baru'}
                                </h2>
                                <button onClick={closeModal} className="p-2 hover:bg-slate-50 rounded-full transition-all text-slate-400">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Nama Lengkap <span className="text-rose-500">*</span></label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-slate-50 border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-indigo-100 transition-all"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder="Nama pelanggan..."
                                        required
                                    />
                                    {errors.name && <p className="text-rose-500 text-[10px] font-bold mt-1 ml-1">{errors.name}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Email <span className="text-rose-500">*</span></label>
                                    <input 
                                        type="email" 
                                        className="w-full bg-slate-50 border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-indigo-100 transition-all"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        placeholder="email@example.com"
                                        required
                                    />
                                    {errors.email && <p className="text-rose-500 text-[10px] font-bold mt-1 ml-1">{errors.email}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Nomor WhatsApp <span className="text-rose-500">*</span></label>
                                    <PhoneInput
                                        international
                                        defaultCountry="ID"
                                        value={data.phone}
                                        onChange={(value) => setData('phone', value || '')}
                                        className="w-full customer-phone-input"
                                        placeholder="812 3456 7890"
                                        required
                                    />
                                    <style>{`
                                        .customer-phone-input {
                                            display: flex;
                                            align-items: center;
                                            width: 100%;
                                            background: #f8fafc;
                                            border: 1px solid #f1f5f9;
                                            border-radius: 0.75rem;
                                            padding: 0 0.5rem;
                                        }
                                        .customer-phone-input input {
                                            flex: 1;
                                            background: transparent;
                                            border: none;
                                            padding: 0.625rem 0.5rem;
                                            font-size: 0.875rem;
                                            font-weight: 700;
                                            outline: none;
                                            box-shadow: none;
                                        }
                                    `}</style>
                                    {errors.phone && <p className="text-rose-500 text-[10px] font-bold mt-1 ml-1">{errors.phone}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Alamat</label>
                                    <textarea 
                                        className="w-full bg-slate-50 border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-indigo-100 transition-all min-h-[80px]"
                                        value={data.address}
                                        onChange={e => setData('address', e.target.value)}
                                        placeholder="Alamat lengkap..."
                                    ></textarea>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md disabled:opacity-50 mt-4"
                                >
                                    {editingCustomer ? 'Simpan Perubahan' : 'Daftarkan Pelanggan'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </SidebarLayout>
    );
}
