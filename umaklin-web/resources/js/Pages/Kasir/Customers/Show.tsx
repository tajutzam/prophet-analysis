import SidebarLayout from '@/Layouts/SidebarLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    ArrowLeft, 
    Mail, 
    Phone, 
    MapPin, 
    Calendar, 
    ShoppingBag, 
    Weight, 
    CreditCard,
    ChevronRight,
    Search,
    Clock,
    CheckCircle2
} from 'lucide-react';

interface Transaction {
    id: number;
    receipt_number: string;
    total_price: number;
    total_weight: number;
    status: string;
    payment_status: string;
    date: string;
    created_at: string;
}

interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
    created_at: string;
}

interface ShowProps {
    customer: Customer;
    transactions: Transaction[];
}

export default function Show({ customer, transactions }: ShowProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
    };

    const stats = [
        { label: 'Total Pesanan', value: transactions.length, icon: ShoppingBag, color: 'bg-blue-50 text-blue-600' },
        { label: 'Total Berat', value: `${transactions.reduce((s, t) => s + Number(t.total_weight), 0).toFixed(1)} Kg`, icon: Weight, color: 'bg-emerald-50 text-emerald-600' },
        { label: 'Total Belanja', value: formatCurrency(transactions.reduce((s, t) => s + Number(t.total_price), 0)), icon: CreditCard, color: 'bg-amber-50 text-amber-600' },
    ];

    return (
        <SidebarLayout>
            <Head title={`Profil ${customer.name}`} />

            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header & Back */}
                <div className="flex items-center justify-between">
                    <Link 
                        href={route('kasir.customers.index')}
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Daftar
                    </Link>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
                        Member ID: #{customer.id.toString().padStart(4, '0')}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <div className="space-y-6">
                        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm text-center space-y-4">
                            <div className="w-24 h-24 rounded-[32px] bg-slate-900 mx-auto flex items-center justify-center text-3xl font-black text-white italic shadow-xl shadow-slate-200">
                                {customer.name.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">{customer.name}</h2>
                                <p className="text-sm text-slate-400 font-medium">Pelanggan Setia</p>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Contact Details</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Email Address</p>
                                        <p className="text-sm font-bold text-slate-700">{customer.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">WhatsApp Number</p>
                                        <p className="text-sm font-bold text-slate-700">{customer.phone || '-'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 group">
                                    <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Delivery Address</p>
                                        <p className="text-sm font-bold text-slate-700 leading-relaxed">{customer.address || 'Alamat belum disetel'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {stats.map((stat, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color}`}>
                                        <stat.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                        <p className="text-lg font-black text-slate-900 italic tracking-tighter">{stat.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Transaction History Table */}
                        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-slate-900 italic tracking-tighter">Laundry History</h3>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">
                                    {transactions.length} Total Activities
                                </div>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50/50 border-b border-slate-100">
                                            <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order Details</th>
                                            <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                            <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {transactions.map((t) => (
                                            <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                                                            <ShoppingBag className="w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <Link href={route('kasir.transactions.show', t.id)} className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors">
                                                                #{t.receipt_number}
                                                            </Link>
                                                            <p className="text-[10px] text-slate-400 font-medium">{new Date(t.date).toLocaleDateString('id-ID')}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${t.status === 'delivered' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">{t.status}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 text-right font-bold text-slate-900">
                                                    {formatCurrency(t.total_price)}
                                                </td>
                                            </tr>
                                        ))}
                                        {transactions.length === 0 && (
                                            <tr>
                                                <td colSpan={3} className="px-8 py-20 text-center">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Search className="w-8 h-8 text-slate-200" />
                                                        <p className="text-sm font-bold text-slate-300 italic">No transaction history found</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
