import SidebarLayout from '@/Layouts/SidebarLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { 
    ArrowLeft, 
    User as UserIcon, 
    Mail, 
    Phone, 
    MapPin, 
    CheckCircle2,
    UserPlus
} from 'lucide-react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        address: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('kasir.customers.store'));
    };

    return (
        <SidebarLayout>
            <Head title="Tambah Pelanggan Baru" />

            <div className="max-w-3xl mx-auto space-y-8">
                <div className="space-y-1">
                    <Link 
                        href={route('kasir.customers.index')}
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium mb-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Daftar Pelanggan
                    </Link>
                    <h1 className="text-3xl font-black text-slate-900 italic tracking-tighter">Register New Member</h1>
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <UserIcon className="w-4 h-4" />
                                Data Pribadi
                            </h3>
                            
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Nama Lengkap</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-slate-50 border-none rounded-2xl px-4 py-4 text-sm font-bold focus:ring-2 focus:ring-slate-200 transition-all"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="Nama Lengkap Pelanggan"
                                />
                                {errors.name && <p className="text-rose-500 text-[10px] font-bold mt-1 ml-1">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Alamat Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input 
                                        type="email" 
                                        className="w-full bg-slate-50 border-none rounded-2xl pl-11 pr-4 py-4 text-sm font-bold focus:ring-2 focus:ring-slate-200 transition-all"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        placeholder="email@example.com"
                                    />
                                </div>
                                {errors.email && <p className="text-rose-500 text-[10px] font-bold mt-1 ml-1">{errors.email}</p>}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                Kontak & Alamat
                            </h3>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Nomor WhatsApp</label>
                                <div className="flex rounded-2xl bg-slate-50 focus-within:ring-2 focus-within:ring-slate-200 transition-all overflow-hidden border border-transparent">
                                    <PhoneInput
                                        international
                                        defaultCountry="ID"
                                        value={data.phone}
                                        onChange={(value) => setData('phone', value || '')}
                                        className="w-full custom-phone-input"
                                        placeholder="812 3456 7890"
                                    />
                                </div>
                                <style>{`
                                    .custom-phone-input {
                                        display: flex;
                                        align-items: center;
                                        width: 100%;
                                    }
                                    .custom-phone-input .PhoneInputCountry {
                                        margin-left: 1rem;
                                        margin-right: 0.5rem;
                                    }
                                    .custom-phone-input input {
                                        flex: 1;
                                        background: transparent;
                                        border: none;
                                        padding: 1rem;
                                        font-size: 0.875rem;
                                        font-weight: 700;
                                        outline: none;
                                        box-shadow: none;
                                    }
                                `}</style>
                                {errors.phone && <p className="text-rose-500 text-[10px] font-bold mt-1 ml-1">{errors.phone}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Alamat Domisili</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                                    <textarea 
                                        className="w-full bg-slate-50 border-none rounded-2xl pl-11 pr-4 py-4 text-sm font-bold focus:ring-2 focus:ring-slate-200 transition-all min-h-[120px]"
                                        value={data.address}
                                        onChange={e => setData('address', e.target.value)}
                                        placeholder="Alamat lengkap..."
                                    ></textarea>
                                </div>
                                {errors.address && <p className="text-rose-500 text-[10px] font-bold mt-1 ml-1">{errors.address}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-50">
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="w-full bg-slate-900 text-white py-5 rounded-[24px] font-black uppercase tracking-[0.2em] text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-slate-200"
                        >
                            {processing ? 'Processing...' : (
                                <>
                                    <UserPlus className="w-5 h-5" />
                                    Confirm Registration
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </SidebarLayout>
    );
}
