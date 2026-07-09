import SidebarLayout from '@/Layouts/SidebarLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { 
    ArrowLeft, FileText, Calendar, 
    CreditCard, Package, Clock, Waves, 
    Star, CheckCircle2, Phone
} from 'lucide-react';

interface Transaction {
    id: number;
    receipt_number: string;
    total_weight: string | null;
    total_price: string | null;
    status: 'pending' | 'washing' | 'ironing' | 'done' | 'delivered';
    payment_status: 'unpaid' | 'paid';
    payment_method: string | null;
    notes: string | null;
    date: string;
    service: {
        name: string;
        price_per_kg: number;
    } | null;
    items: Array<{
        id: number;
        service_id: number;
        weight: string;
        price: string;
        service: { name: string } | null;
    }>;
}

interface OrderDetailProps extends PageProps {
    transaction: Transaction;
}

export default function OrderDetail({ transaction }: OrderDetailProps) {
    const formatCurrency = (amount: string | number | null) => {
        if (!amount) return 'Rp0';
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(amount));
    };

    const steps = [
        { id: 'pending', label: 'Diterima', icon: Clock },
        { id: 'washing', label: 'Proses Cuci', icon: Waves },
        { id: 'ironing', label: 'Proses Setrika', icon: Star },
        { id: 'done', label: 'Selesai', icon: CheckCircle2 },
        { id: 'delivered', label: 'Sudah Diambil', icon: Package },
    ];

    const currentIdx = steps.findIndex(s => s.id === transaction.status);
    const isDelivered = transaction.status === 'delivered';

    return (
        <SidebarLayout header={`Pesanan #${transaction.receipt_number}`}>
            <Head title={`Detail Pesanan #${transaction.receipt_number}`} />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Back Action */}
                <Link 
                    href={route('pelanggan.orders')} 
                    className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Daftar Pesanan
                </Link>

                {/* Status Stepper */}
                <div className="bg-white p-6 rounded-xl border border-slate-200">
                    <h3 className="text-sm font-bold text-slate-900 mb-6">Status Pengerjaan</h3>
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                        {steps.map((step, idx) => {
                            const isPast = idx <= currentIdx || isDelivered;
                            const isCurrent = idx === currentIdx && !isDelivered;
                            return (
                                <div key={step.id} className="flex items-center gap-3 flex-1">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${isPast ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                                        <step.icon className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className={`text-xs font-bold ${isPast ? 'text-slate-900' : 'text-slate-400'}`}>{step.label}</p>
                                        {isCurrent && <p className="text-[10px] text-indigo-600 font-bold animate-pulse">Sedang diproses</p>}
                                    </div>
                                    {idx < steps.length - 1 && <div className="hidden lg:block flex-1 h-px bg-slate-100 mx-2"></div>}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Items List */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                                <h3 className="text-sm font-bold text-slate-900">Rincian Barang</h3>
                            </div>
                            <table className="w-full text-left">
                                <tbody className="divide-y divide-slate-100">
                                    {transaction.items && transaction.items.length > 0 ? transaction.items.map((item, i) => (
                                        <tr key={i}>
                                            <td className="px-6 py-4 text-sm font-medium text-slate-900">{item.service?.name || 'Laundry'}</td>
                                            <td className="px-6 py-4 text-sm text-slate-500 text-right">{item.weight} kg</td>
                                            <td className="px-6 py-4 text-sm font-bold text-slate-900 text-right">{formatCurrency(item.price)}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td className="px-6 py-4 text-sm font-medium text-slate-900">{transaction.service?.name || 'Layanan Laundry'}</td>
                                            <td className="px-6 py-4 text-sm text-slate-500 text-right">{transaction.total_weight || '-'} kg</td>
                                            <td className="px-6 py-4 text-sm font-bold text-slate-900 text-right">{formatCurrency(transaction.total_price)}</td>
                                        </tr>
                                    )}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-slate-50 font-bold">
                                        <td colSpan={2} className="px-6 py-4 text-sm text-slate-900">Total Pembayaran</td>
                                        <td className="px-6 py-4 text-sm text-indigo-600 text-right">{formatCurrency(transaction.total_price)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        {/* Special Notes */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200">
                            <h3 className="text-sm font-bold text-slate-900 mb-3">Catatan Khusus</h3>
                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 italic text-sm text-slate-600">
                                {transaction.notes || 'Tidak ada catatan khusus.'}
                            </div>
                        </div>
                    </div>

                    {/* Transaction Info */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
                            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Info Transaksi</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-400 font-medium">No. Resi</span>
                                    <span className="text-xs font-bold text-slate-900">#{transaction.receipt_number}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-400 font-medium">Tanggal</span>
                                    <span className="text-xs font-bold text-slate-900">{new Date(transaction.date).toLocaleDateString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-400 font-medium">Pembayaran</span>
                                    <span className={`text-xs font-bold uppercase ${transaction.payment_status === 'paid' ? 'text-emerald-600' : 'text-rose-500'}`}>
                                        {transaction.payment_status === 'paid' ? 'Lunas' : 'Belum Bayar'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-400 font-medium">Metode</span>
                                    <span className="text-xs font-bold text-slate-900">{transaction.payment_method || '-'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 flex flex-col items-center text-center">
                            <Phone className="w-8 h-8 text-indigo-600 mb-3" />
                            <h4 className="text-sm font-bold text-indigo-900">Butuh Bantuan?</h4>
                            <p className="text-xs text-indigo-600 mt-1 mb-4">Hubungi admin kami untuk perubahan pesanan.</p>
                            <button className="w-full py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors">
                                Hubungi Admin
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
