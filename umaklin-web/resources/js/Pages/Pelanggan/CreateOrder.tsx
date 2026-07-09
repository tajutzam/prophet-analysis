import SidebarLayout from '@/Layouts/SidebarLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { 
    ArrowLeft, Check, Info, Waves, Clock
} from 'lucide-react';

interface LaundryService {
    id: number;
    name: string;
    price_per_kg: number;
    description: string | null;
}

interface CreateOrderProps extends PageProps {
    services: LaundryService[];
}

export default function CreateOrder({ services }: CreateOrderProps) {
    const { data, setData, post, processing, errors } = useForm({
        services: [] as Array<{ id: string, weight: number }>,
        payment_method: 'cash',
        notes: '',
    });

    const toggleService = (id: string) => {
        const currentServices = [...data.services];
        const index = currentServices.findIndex(s => s.id === id);
        if (index > -1) {
            currentServices.splice(index, 1);
        } else {
            currentServices.push({ id, weight: 1 });
        }
        setData('services', currentServices);
    };

    const updateWeight = (id: string, weight: number) => {
        const currentServices = data.services.map(s => 
            s.id === id ? { ...s, weight: Math.max(0, weight) } : s
        );
        setData('services', currentServices);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('pelanggan.orders.store'));
    };

    const formatCurrency = (amount: string | number | null) => {
        if (!amount) return 'Rp0';
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(amount));
    };

    return (
        <SidebarLayout header="Buat Pesanan Baru">
            <Head title="Buat Pesanan" />

            <div className="max-w-3xl mx-auto space-y-6">
                {/* Back Link */}
                <Link 
                    href={route('pelanggan.orders')} 
                    className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Riwayat Pesanan
                </Link>

                <form onSubmit={submit} className="space-y-6">
                    {/* Service Selection */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-slate-900">Pilih Layanan</h3>
                            <Info className="w-4 h-4 text-slate-400" />
                        </div>
                        
                        <div className="grid grid-cols-1 gap-3">
                            {services.map((service) => {
                                const selectedService = data.services.find(s => s.id === String(service.id));
                                return (
                                    <div 
                                        key={service.id}
                                        className={`relative flex flex-col p-4 rounded-lg border transition-all ${
                                            selectedService
                                            ? 'bg-indigo-50 border-indigo-600 ring-1 ring-indigo-600' 
                                            : 'bg-white border-slate-200 hover:border-slate-300'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <button 
                                                type="button"
                                                onClick={() => toggleService(String(service.id))}
                                                className="flex items-center gap-4 text-left flex-1"
                                            >
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                                    selectedService ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
                                                }`}>
                                                    {selectedService ? <Check className="w-5 h-5" /> : <Waves className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">{service.name}</p>
                                                    <p className="text-xs text-slate-500">{service.description || 'Layanan profesional Umaklin.'}</p>
                                                </div>
                                            </button>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-indigo-600">{formatCurrency(service.price_per_kg)}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Per Kg</p>
                                            </div>
                                        </div>

                                        {selectedService && (
                                            <div className="mt-3 pt-3 border-t border-indigo-100 flex items-center justify-between">
                                                <span className="text-xs font-bold text-indigo-900">Estimasi Berat:</span>
                                                <div className="flex items-center gap-3">
                                                    <button 
                                                        type="button"
                                                        onClick={() => updateWeight(selectedService.id, selectedService.weight - 0.5)}
                                                        className="w-8 h-8 rounded bg-white border border-indigo-200 text-indigo-600 flex items-center justify-center font-bold hover:bg-indigo-600 hover:text-white transition-colors"
                                                    >-</button>
                                                    <div className="flex items-center gap-1">
                                                        <input 
                                                            type="number" 
                                                            step="0.1"
                                                            value={selectedService.weight}
                                                            onChange={(e) => updateWeight(selectedService.id, parseFloat(e.target.value) || 0)}
                                                            className="w-16 p-1 bg-white border-none text-center text-sm font-bold text-slate-900 focus:ring-0"
                                                        />
                                                        <span className="text-xs font-bold text-slate-400">kg</span>
                                                    </div>
                                                    <button 
                                                        type="button"
                                                        onClick={() => updateWeight(selectedService.id, selectedService.weight + 0.5)}
                                                        className="w-8 h-8 rounded bg-white border border-indigo-200 text-indigo-600 flex items-center justify-center font-bold hover:bg-indigo-600 hover:text-white transition-colors"
                                                    >+</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        {errors.services && <p className="text-xs text-rose-500 font-medium mt-1">{errors.services}</p>}
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-slate-900">Metode Pembayaran</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {[
                                { id: 'cash', label: 'Tunai', icon: '💵' },
                                { id: 'transfer', label: 'Transfer', icon: '🏦' },
                                { id: 'qris', label: 'QRIS', icon: '📱' },
                            ].map((method) => (
                                <button
                                    key={method.id}
                                    type="button"
                                    onClick={() => setData('payment_method', method.id)}
                                    className={`flex items-center justify-center gap-3 p-3 rounded-lg border transition-all ${
                                        data.payment_method === method.id 
                                        ? 'bg-indigo-50 border-indigo-600 text-indigo-600 font-bold' 
                                        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                                    }`}
                                >
                                    <span>{method.icon}</span>
                                    <span className="text-sm">{method.label}</span>
                                </button>
                            ))}
                        </div>
                        {errors.payment_method && <p className="text-xs text-rose-500 font-medium mt-1">{errors.payment_method}</p>}
                    </div>

                    {/* Special Instructions */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
                        <h3 className="font-bold text-slate-900">Instruksi Khusus (Opsional)</h3>
                        <textarea 
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 min-h-[120px] transition-all"
                            placeholder="Contoh: Pisahkan baju putih, jangan pakai pewangi, dll."
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                        ></textarea>
                        {errors.notes && <p className="text-xs text-rose-500 font-medium mt-1">{errors.notes}</p>}
                    </div>

                    {/* Order Preview / Summary */}
                    {data.services.length > 0 && (
                        <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
                            <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3">Ringkasan Pesanan</h3>
                            <div className="space-y-3">
                                {data.services.map(s => {
                                    const service = services.find(srv => String(srv.id) === s.id);
                                    if (!service) return null;
                                    return (
                                        <div key={s.id} className="flex justify-between items-center text-sm">
                                            <div className="flex flex-col">
                                                <span className="text-slate-600 font-medium">{service.name}</span>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase">{s.weight} kg × {formatCurrency(service.price_per_kg)}</span>
                                            </div>
                                            <span className="text-slate-900 font-bold">{formatCurrency(s.weight * Number(service.price_per_kg))}</span>
                                        </div>
                                    );
                                })}
                                <div className="pt-3 border-t border-slate-50 flex justify-between items-center">
                                    <span className="text-sm font-bold text-slate-900">Total Estimasi</span>
                                    <span className="text-lg font-black text-indigo-600">
                                        {formatCurrency(data.services.reduce((total, s) => {
                                            const service = services.find(srv => String(srv.id) === s.id);
                                            return total + (s.weight * Number(service?.price_per_kg || 0));
                                        }, 0))}
                                    </span>
                                </div>
                                <div className="pt-3 border-t border-slate-50 flex justify-between items-center text-[10px]">
                                    <span className="text-slate-400 font-medium font-bold uppercase tracking-wider">Metode Pembayaran</span>
                                    <span className="text-slate-900 font-bold uppercase">{data.payment_method}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Summary & Submit */}
                    <div className="bg-slate-900 p-6 rounded-xl text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-300">Estimasi Pengerjaan</p>
                                <p className="text-lg font-bold">± 48 Jam Kerja</p>
                            </div>
                        </div>
                        <button 
                            type="submit"
                            disabled={processing || data.services.length === 0}
                            className="w-full sm:w-auto px-10 py-3 bg-white text-slate-900 rounded-lg text-sm font-black uppercase tracking-wider hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Konfirmasi Pesanan
                        </button>
                    </div>

                    <p className="text-center text-xs text-slate-400">
                        Pakaian Anda akan ditimbang dan divalidasi oleh kasir saat di gerai.
                    </p>
                </form>
            </div>
        </SidebarLayout>
    );
}
