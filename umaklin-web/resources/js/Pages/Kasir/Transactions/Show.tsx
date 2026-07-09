import SidebarLayout from '@/Layouts/SidebarLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { 
    ArrowLeft, 
    Printer, 
    CheckCircle2, 
    Clock, 
    Truck, 
    Calendar,
    User,
    CreditCard,
    Weight,
    Package,
    ArrowRight,
    X,
    Waves,
    Star,
    Phone,
    FileText
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface LaundryService {
    id: number;
    name: string;
    duration_hours: number;
}

interface TransactionItem {
    id: number;
    service_id: number;
    weight: number;
    price: number;
    service: LaundryService;
}

interface Transaction {
    id: number;
    receipt_number: string;
    total_price: number;
    total_weight: number;
    status: 'pending' | 'washing' | 'ironing' | 'done' | 'delivered';
    payment_status: 'paid' | 'unpaid';
    payment_method: string;
    notes: string | null;
    date: string;
    created_at: string;
    service?: LaundryService;
    items: TransactionItem[];
    user: {
        id: number;
        name: string;
        email: string;
        phone?: string;
        address?: string | null;
    };
}

const Countdown = ({ transaction }: { transaction: Transaction }) => {
    const [timeLeft, setTimeLeft] = useState<{ hours: number, minutes: number } | null>(null);

    useEffect(() => {
        const calculateTime = () => {
            const createdAt = new Date(transaction.created_at).getTime();
            // Get the maximum duration from all services in items
            const maxDuration = transaction.items?.length > 0 
                ? Math.max(...transaction.items.map(item => item.service?.duration_hours || 0))
                : (transaction.service?.duration_hours || 24);
            
            const durationMs = maxDuration * 60 * 60 * 1000;
            const targetTime = createdAt + durationMs;
            const now = new Date().getTime();
            
            const diff = targetTime - now;

            if (diff <= 0 || transaction.status === 'done' || transaction.status === 'delivered') {
                setTimeLeft(null);
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            setTimeLeft({ hours, minutes });
        };

        calculateTime();
        const timer = setInterval(calculateTime, 60000);

        return () => clearInterval(timer);
    }, [transaction]);

    if (transaction.status === 'done' || transaction.status === 'delivered') {
        return (
            <div className="flex flex-col">
                <span className="text-2xl font-black uppercase tracking-tighter text-white">Selesai</span>
                <span className="text-[10px] font-bold opacity-70 tracking-widest uppercase text-white">Pesanan Siap</span>
            </div>
        );
    }

    if (!timeLeft) {
        return (
            <div className="flex flex-col text-rose-200">
                <span className="text-2xl font-black uppercase tracking-tighter">Terlambat</span>
                <span className="text-[10px] font-bold opacity-90 tracking-widest uppercase">Segera Selesaikan</span>
            </div>
        );
    }

    return (
        <div className="flex items-end gap-2 text-white">
            <span className="text-4xl font-black leading-none">{timeLeft.hours}</span>
            <span className="text-sm font-bold mb-1 opacity-80 uppercase tracking-tighter text-white">Jam</span>
            <span className="text-4xl font-black leading-none ml-2">{timeLeft.minutes}</span>
            <span className="text-sm font-bold mb-1 opacity-80 uppercase tracking-tighter text-white">Menit</span>
        </div>
    );
};

interface ShowProps extends PageProps {
    transaction: Transaction;
}

export default function Show({ transaction }: ShowProps) {
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const { data, setData, put, processing } = useForm({
        status: transaction.status,
        payment_status: transaction.payment_status,
        user_id: transaction.user.id,
        payment_method: transaction.payment_method,
        date: transaction.date,
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
    };

    const getStatusStep = (currentStatus: string) => {
        const steps = ['pending', 'washing', 'ironing', 'done', 'delivered'];
        return steps.indexOf(currentStatus);
    };

    const steps = [
        { key: 'pending', label: 'Diterima', icon: Clock },
        { key: 'washing', label: 'Proses Cuci', icon: Waves },
        { key: 'ironing', label: 'Proses Setrika', icon: Star },
        { key: 'done', label: 'Selesai', icon: CheckCircle2 },
        { key: 'delivered', label: 'Sudah Diambil', icon: Package },
    ];

    const currentStep = steps.findIndex(s => s.key === transaction.status);
    const isDelivered = transaction.status === 'delivered';

    const handlePrint = () => {
        window.print();
    };

    const handleUpdateStatus = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('kasir.transactions.update', transaction.id), {
            onSuccess: () => setIsUpdateModalOpen(false),
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        const day = String(date.getDate()).padStart(2, '0');
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    return (
        <SidebarLayout header={`Detail Transaksi #${transaction.receipt_number}`}>
            <Head title={`Detail Transaksi #${transaction.receipt_number}`} />

            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    body * { visibility: hidden; }
                    #receipt-print-wrapper, #receipt-print-wrapper * { visibility: visible; }
                    #receipt-print-wrapper { 
                        position: absolute; 
                        left: 0; 
                        top: 0; 
                        width: 100%; 
                        display: block !important;
                    }
                    .no-print { display: none !important; }
                }
                @media screen {
                    #receipt-print-wrapper { display: none; }
                }
            `}} />

            {/* Custom thermal receipt design (mimicking the user's example) */}
            <div id="receipt-print-wrapper" className="w-[80mm] p-6 bg-white text-black font-mono text-[12px] leading-relaxed mx-auto border border-black rounded-lg">
                <div className="text-center space-y-1">
                    <h2 className="text-sm font-bold uppercase tracking-wider">Umaklin Laundry</h2>
                    <div className="border-t border-black my-2"></div>
                    <h1 className="text-xl font-bold tracking-tight my-2">{transaction.user.name}</h1>
                    {transaction.user.address && (
                        <p className="text-[10px] text-gray-700 leading-tight">{transaction.user.address}</p>
                    )}
                </div>
                
                <div className="border-t border-dashed border-black my-4"></div>
                
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span>No. resi</span>
                        <span className="font-bold">{transaction.receipt_number}</span>
                    </div>

                    {transaction.items && transaction.items.length > 0 ? (
                        transaction.items.map((item, idx) => (
                            <div key={idx} className="space-y-0.5">
                                <div className="flex justify-between">
                                    <span>Layanan</span>
                                    <span className="font-bold">{item.service?.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Berat</span>
                                    <span className="font-bold">{item.weight} kg</span>
                                </div>
                                <div className="flex justify-between text-[10px] text-gray-600 pl-2">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(item.price)}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <>
                            <div className="flex justify-between">
                                <span>Layanan</span>
                                <span className="font-bold">{transaction.service?.name || 'Layanan Laundry'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Berat</span>
                                <span className="font-bold">{transaction.total_weight} kg</span>
                            </div>
                        </>
                    )}

                    <div className="flex justify-between">
                        <span>Tanggal masuk</span>
                        <span>{formatDate(transaction.date)}</span>
                    </div>

                    <div className="border-t border-dashed border-black my-3"></div>

                    <div className="flex justify-between font-bold text-sm">
                        <span>Total Tagihan</span>
                        <span>{formatCurrency(transaction.total_price)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Metode Bayar</span>
                        <span className="uppercase">{transaction.payment_method}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Status</span>
                        <span className="font-bold">{transaction.payment_status === 'paid' ? 'LUNAS' : 'BELUM BAYAR'}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto space-y-6 no-print">
                <div className="flex items-center justify-between">
                    <Link 
                        href={route('kasir.transactions.index')}
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors text-sm font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Daftar Transaksi
                    </Link>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={handlePrint}
                            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm"
                        >
                            <Printer className="w-4 h-4" />
                            Cetak Resi
                        </button>
                        <button 
                            onClick={() => setIsUpdateModalOpen(true)}
                            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                        >
                            Update Status
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Status Stepper */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-900 mb-6">Status Pengerjaan</h3>
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                        {steps.map((step, idx) => {
                            const isPast = idx <= currentStep || isDelivered;
                            const isCurrent = idx === currentStep && !isDelivered;
                            return (
                                <div key={step.key} className="flex items-center gap-3 flex-1">
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white transition-all duration-300 ${isPast ? 'bg-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Items Card */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                                <h3 className="text-sm font-bold text-slate-900">Rincian Layanan</h3>
                            </div>
                            
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/30 border-b border-slate-50">
                                    <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                        <th className="px-6 py-3">Layanan</th>
                                        <th className="px-6 py-3 text-center">Berat</th>
                                        <th className="px-6 py-3 text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {transaction.items && transaction.items.length > 0 ? (
                                        transaction.items.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors text-sm">
                                                <td className="px-6 py-4 font-medium text-slate-700">{item.service?.name}</td>
                                                <td className="px-6 py-4 text-center text-slate-500">{item.weight} Kg</td>
                                                <td className="px-6 py-4 text-right font-bold text-slate-900">{formatCurrency(item.price)}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr className="hover:bg-slate-50/50 transition-colors text-sm">
                                            <td className="px-6 py-4 font-medium text-slate-700">{transaction.service?.name || 'Layanan Laundry'}</td>
                                            <td className="px-6 py-4 text-center text-slate-500">{transaction.total_weight} Kg</td>
                                            <td className="px-6 py-4 text-right font-bold text-slate-900">{formatCurrency(transaction.total_price)}</td>
                                        </tr>
                                    )}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-indigo-600 text-white font-bold">
                                        <td colSpan={2} className="px-6 py-4 text-sm">Total Tagihan</td>
                                        <td className="px-6 py-4 text-right text-lg">{formatCurrency(transaction.total_price)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        {/* Notes */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-indigo-600" />
                                Catatan Kasir
                            </h3>
                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-600 leading-relaxed italic">
                                {transaction.notes || 'Tidak ada catatan tambahan.'}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 no-print">
                        {/* Profile Info */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                                <User className="w-4 h-4 text-indigo-600" />
                                Profil Pelanggan
                            </h3>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-sm font-bold text-indigo-600 border border-indigo-100">
                                    {transaction.user.name.charAt(0)}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-bold text-slate-900 truncate">{transaction.user.name}</span>
                                    <span className="text-[10px] text-slate-400 font-medium truncate">{transaction.user.email}</span>
                                </div>
                            </div>
                            <div className="pt-2 space-y-2 border-t border-slate-50">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-400 font-medium">WhatsApp</span>
                                    <span className="text-slate-900 font-bold">{transaction.user.phone || '-'}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-400 font-medium">Metode Bayar</span>
                                    <span className="text-slate-900 font-bold uppercase">{transaction.payment_method}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-400 font-medium">Pembayaran</span>
                                    <span className={`font-bold ${transaction.payment_status === 'paid' ? 'text-emerald-600' : 'text-rose-500'}`}>
                                        {transaction.payment_status === 'paid' ? 'LUNAS' : 'BELUM BAYAR'}
                                    </span>
                                </div>
                            </div>
                            <button 
                                onClick={() => {
                                    const phone = transaction.user.phone || '081234567890';
                                    const formattedPhone = phone.startsWith('0') ? '62' + phone.slice(1) : phone;
                                    const message = encodeURIComponent(
                                        `Halo *${transaction.user.name}*, pesanan laundry Anda di *Umaklin* dengan nomor resi *#${transaction.receipt_number}* saat ini statusnya adalah *${transaction.status.toUpperCase()}*.\n\n` +
                                        `Total tagihan: *${formatCurrency(transaction.total_price)}*\n` +
                                        `Status Pembayaran: *${transaction.payment_status === 'paid' ? 'LUNAS' : 'BELUM BAYAR'}*\n\n` +
                                        `Terima kasih telah mempercayakan cucian Anda kepada kami! 🙏`
                                    );
                                    window.open(`https://wa.me/${formattedPhone}?text=${message}`, '_blank');
                                }}
                                className="w-full mt-2 bg-slate-900 text-white py-2.5 rounded-lg text-xs font-bold hover:bg-slate-800 transition-all shadow-sm"
                            >
                                Kirim Notifikasi WA
                            </button>
                        </div>

                        {/* AI Prediction */}
                        <div className="bg-indigo-600 p-6 rounded-xl text-white space-y-4 shadow-lg shadow-indigo-100">
                            <div className="flex items-center gap-2 opacity-80 uppercase tracking-wider text-[10px] font-bold">
                                <Clock className="w-3 h-3" />
                                Estimasi AI Engine
                            </div>
                            <Countdown transaction={transaction} />
                            <p className="text-[11px] opacity-80 leading-relaxed">Prediksi penyelesaian berdasarkan beban kerja mesin secara real-time.</p>
                        </div>
                    </div>
                </div>
            </div>

            {isUpdateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsUpdateModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-bold text-slate-900">Update Status Transaksi</h2>
                                <button onClick={() => setIsUpdateModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full transition-all text-slate-400">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <form onSubmit={handleUpdateStatus} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Status Pengerjaan</label>
                                    <select 
                                        className="w-full bg-slate-50 border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-100 transition-all"
                                        value={data.status}
                                        onChange={e => setData('status', e.target.value as any)}
                                    >
                                        <option value="pending">Diterima (Pending)</option>
                                        <option value="washing">Proses Cuci (Washing)</option>
                                        <option value="ironing">Proses Setrika (Ironing)</option>
                                        <option value="done">Selesai (Done)</option>
                                        <option value="delivered">Sudah Diambil (Delivered)</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Status Pembayaran</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button 
                                            type="button"
                                            onClick={() => setData('payment_status', 'unpaid')}
                                            className={`py-3 rounded-lg text-xs font-bold border transition-all ${data.payment_status === 'unpaid' ? 'border-rose-500 bg-rose-50 text-rose-600' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                                        >
                                            Belum Bayar
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => setData('payment_status', 'paid')}
                                            className={`py-3 rounded-lg text-xs font-bold border transition-all ${data.payment_status === 'paid' ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                                        >
                                            Lunas
                                        </button>
                                    </div>
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
