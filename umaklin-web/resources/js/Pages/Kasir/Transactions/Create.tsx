import SidebarLayout from '@/Layouts/SidebarLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { 
    Plus, 
    Trash2, 
    ArrowLeft, 
    User as UserIcon, 
    Calendar, 
    CreditCard, 
    CheckCircle2,
    Package,
    Weight,
    Calculator
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface LaundryService {
    id: number;
    name: string;
    price_per_kg: number;
    duration_hours: number;
}

interface Customer {
    id: number;
    name: string;
    email: string;
}

interface CreateProps extends PageProps {
    services: LaundryService[];
    customers: Customer[];
}

interface TransactionItem {
    service_id: string;
    weight: string;
    price: number;
}

export default function Create({ services, customers }: CreateProps) {
    const [items, setItems] = useState<TransactionItem[]>([
        { service_id: '', weight: '', price: 0 }
    ]);

    const { data, setData, post, processing, errors } = useForm({
        user_id: '',
        payment_method: 'cash',
        payment_status: 'unpaid',
        date: new Date().toISOString().split('T')[0],
        items: [] as any[],
    });

    const addItem = () => {
        setItems([...items, { service_id: '', weight: '', price: 0 }]);
    };

    const removeItem = (index: number) => {
        if (items.length > 1) {
            const newItems = items.filter((_, i) => i !== index);
            setItems(newItems);
        }
    };

    const updateItem = (index: number, field: keyof TransactionItem, value: string) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };

        // Auto-calculate price if service or weight changes
        if (field === 'service_id' || field === 'weight') {
            const service = services.find(s => s.id.toString() === (field === 'service_id' ? value : newItems[index].service_id));
            const weight = parseFloat(field === 'weight' ? value : newItems[index].weight);
            
            if (service && !isNaN(weight)) {
                newItems[index].price = service.price_per_kg * weight;
            } else {
                newItems[index].price = 0;
            }
        }

        setItems(newItems);
    };

    const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
    const totalWeight = items.reduce((sum, item) => sum + (parseFloat(item.weight) || 0), 0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setData('items', items); // This might be stale due to async setData
        // Better: pass the items directly in the post if using a different approach, 
        // but since we're using Inertia useForm, we should sync it.
    };

    // Keep useForm data in sync with local items state
    useEffect(() => {
        setData('items', items);
    }, [items]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
    };

    return (
        <SidebarLayout header="Buat Transaksi Baru">
            <Head title="Buat Transaksi Baru" />

            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <Link 
                            href={route('kasir.transactions.index')}
                            className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors text-sm font-medium"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Kembali ke Daftar
                        </Link>
                        <h1 className="text-2xl font-bold text-slate-900">Input Pesanan Baru</h1>
                    </div>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); post(route('kasir.transactions.store')); }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Form Area */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Customer & Info Card */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                                <UserIcon className="w-4 h-4 text-indigo-600" />
                                Informasi Pelanggan
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Pelanggan</label>
                                    <select 
                                        className="w-full bg-slate-50 border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-indigo-100 transition-all"
                                        value={data.user_id}
                                        onChange={e => setData('user_id', e.target.value)}
                                    >
                                        <option value="">Pilih Pelanggan...</option>
                                        {customers.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                    {errors.user_id && <p className="text-rose-500 text-[10px] font-bold mt-1 ml-1">{errors.user_id}</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Tanggal Pesanan</label>
                                    <input 
                                        type="date" 
                                        className="w-full bg-slate-50 border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-indigo-100 transition-all"
                                        value={data.date}
                                        onChange={e => setData('date', e.target.value)}
                                    />
                                    {errors.date && <p className="text-rose-500 text-[10px] font-bold mt-1 ml-1">{errors.date}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Services List Card */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                    <Package className="w-4 h-4 text-indigo-600" />
                                    Daftar Layanan
                                </h3>
                                <button 
                                    type="button"
                                    onClick={addItem}
                                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Tambah
                                </button>
                            </div>

                            <div className="space-y-3">
                                {items.map((item, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                        <div className="md:col-span-6 space-y-1">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Layanan</label>
                                            <select 
                                                className="w-full bg-white border-slate-200 rounded-lg px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-indigo-100 transition-all"
                                                value={item.service_id}
                                                onChange={e => updateItem(index, 'service_id', e.target.value)}
                                            >
                                                <option value="">Pilih Layanan...</option>
                                                {services.map(s => (
                                                    <option key={s.id} value={s.id}>{s.name} ({formatCurrency(s.price_per_kg)}/Kg)</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="md:col-span-3 space-y-1">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Berat (Kg)</label>
                                            <input 
                                                type="number" 
                                                step="0.1"
                                                className="w-full bg-white border-slate-200 rounded-lg px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-indigo-100"
                                                value={item.weight}
                                                onChange={e => updateItem(index, 'weight', e.target.value)}
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-1">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Subtotal</label>
                                            <div className="py-2 font-bold text-xs text-slate-900">
                                                {formatCurrency(item.price)}
                                            </div>
                                        </div>
                                        <div className="md:col-span-1 flex items-end justify-center pb-1">
                                            <button 
                                                type="button"
                                                onClick={() => removeItem(index)}
                                                disabled={items.length === 1}
                                                className="p-2 text-slate-300 hover:text-rose-500 transition-colors disabled:opacity-0"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {errors.items && <p className="text-rose-500 text-[10px] font-bold mt-1">{errors.items}</p>}
                        </div>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6 sticky top-6">
                            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Ringkasan Pesanan</h3>
                            
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Total Berat</span>
                                    <span className="font-bold text-slate-900">{totalWeight.toFixed(1)} Kg</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Jumlah Layanan</span>
                                    <span className="font-bold text-slate-900">{items.length} Item</span>
                                </div>
                                <div className="pt-4 border-t border-slate-100">
                                    <div className="flex justify-between items-end">
                                        <span className="text-xs font-bold text-slate-500 uppercase">Total Tagihan</span>
                                        <span className="text-xl font-bold text-indigo-600">{formatCurrency(totalPrice)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-2">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Metode Bayar</label>
                                    <select 
                                        className="w-full bg-slate-50 border-slate-100 rounded-xl px-4 py-2.5 text-xs font-bold focus:ring-2 focus:ring-indigo-100"
                                        value={data.payment_method}
                                        onChange={e => setData('payment_method', e.target.value)}
                                    >
                                        <option value="cash">Tunai (Cash)</option>
                                        <option value="transfer">Transfer</option>
                                        <option value="qris">QRIS</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status Bayar</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button 
                                            type="button"
                                            onClick={() => setData('payment_status', 'unpaid')}
                                            className={`py-2 rounded-lg text-[10px] font-bold border transition-all ${data.payment_status === 'unpaid' ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                                        >
                                            BELUM BAYAR
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => setData('payment_status', 'paid')}
                                            className={`py-2 rounded-lg text-[10px] font-bold border transition-all ${data.payment_status === 'paid' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                                        >
                                            LUNAS
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button 
                                type="submit"
                                disabled={processing || totalPrice === 0}
                                className="w-full bg-indigo-600 text-white py-3.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md disabled:opacity-50"
                            >
                                {processing ? 'Memproses...' : 'Buat Pesanan'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </SidebarLayout>
    );
}
