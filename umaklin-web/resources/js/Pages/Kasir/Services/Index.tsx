import SidebarLayout from '@/Layouts/SidebarLayout';
import { Head, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { 
    Plus, 
    Settings2, 
    Trash2, 
    Clock, 
    Zap, 
    Waves, 
    Sun,
    CheckCircle2,
    X,
    Info
} from 'lucide-react';
import { useState } from 'react';

interface LaundryService {
    id: number;
    name: string;
    price_per_kg: number;
    duration_hours: number;
    type: string;
}

interface IndexProps extends PageProps {
    services: LaundryService[];
}

export default function Index({ services }: IndexProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<LaundryService | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        price_per_kg: '',
        duration_hours: '',
        type: 'regular',
    });

    const openModal = (service: LaundryService | null = null) => {
        if (service) {
            setEditingService(service);
            setData({
                name: service.name,
                price_per_kg: service.price_per_kg.toString(),
                duration_hours: service.duration_hours.toString(),
                type: service.type,
            });
        } else {
            setEditingService(null);
            reset();
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingService) {
            put(route('kasir.services.update', editingService.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('kasir.services.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus layanan ini?')) {
            destroy(route('kasir.services.destroy', id));
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'express': return <Zap className="w-5 h-5 text-amber-500" />;
            case 'regular': return <Waves className="w-5 h-5 text-blue-500" />;
            case 'premium': return <Sun className="w-5 h-5 text-rose-500" />;
            default: return <Clock className="w-5 h-5 text-slate-500" />;
        }
    };

    return (
        <SidebarLayout header="Menu Layanan">
            <Head title="Menu Layanan" />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Jenis Layanan</h1>
                        <p className="text-slate-500 text-sm">Kelola daftar layanan dan harga laundry.</p>
                    </div>
                    <button 
                        onClick={() => openModal()}
                        className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Layanan
                    </button>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <div key={service.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-indigo-50 rounded-lg">
                                    {getTypeIcon(service.type)}
                                </div>
                                <div className="flex items-center gap-1">
                                    <button 
                                        onClick={() => openModal(service)}
                                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                    >
                                        <Settings2 className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(service.id)}
                                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">{service.name}</h3>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{service.type} service</span>
                                </div>

                                <div className="flex items-end justify-between pt-4 border-t border-slate-100">
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">Harga/Kg</p>
                                        <p className="text-lg font-bold text-slate-900">{formatCurrency(service.price_per_kg)}</p>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">Estimasi</p>
                                        <p className="text-xs font-bold text-slate-600">{service.duration_hours} Jam</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal Form Simplified */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeModal}></div>
                        <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                            <div className="p-6 space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg font-bold text-slate-900">{editingService ? 'Edit Layanan' : 'Layanan Baru'}</h2>
                                    <button onClick={closeModal} className="p-2 hover:bg-slate-50 rounded-full transition-all text-slate-400">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Nama Layanan</label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-slate-50 border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-indigo-100 transition-all"
                                            placeholder="Misal: Cuci Kering Ekspres"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                        />
                                        {errors.name && <p className="text-[10px] text-rose-500 font-bold mt-1 ml-1">{errors.name}</p>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Harga/Kg</label>
                                            <input 
                                                type="number" 
                                                className="w-full bg-slate-50 border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-indigo-100 transition-all"
                                                placeholder="7000"
                                                value={data.price_per_kg}
                                                onChange={e => setData('price_per_kg', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Durasi (Jam)</label>
                                            <input 
                                                type="number" 
                                                className="w-full bg-slate-50 border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-indigo-100 transition-all"
                                                placeholder="24"
                                                value={data.duration_hours}
                                                onChange={e => setData('duration_hours', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Tipe Layanan</label>
                                        <select 
                                            className="w-full bg-slate-50 border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-indigo-100 transition-all"
                                            value={data.type}
                                            onChange={e => setData('type', e.target.value)}
                                        >
                                            <option value="regular">Regular</option>
                                            <option value="express">Express</option>
                                            <option value="premium">Premium</option>
                                        </select>
                                    </div>

                                    <div className="pt-4">
                                        <button 
                                            type="submit" 
                                            disabled={processing}
                                            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md disabled:opacity-50"
                                        >
                                            {editingService ? 'Simpan Perubahan' : 'Buat Layanan'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </SidebarLayout>
    );
}
