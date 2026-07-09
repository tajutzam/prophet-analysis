import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { 
    Clock, 
    Droplets, 
    ShieldCheck, 
    Sparkles, 
    Wind,
    Shirt,
    WashingMachine,
    ChevronRight,
    Search,
    Star
} from 'lucide-react';

interface LaundryService {
    id: number;
    name: string;
    price_per_kg: number;
    duration_hours: number;
    type: string;
}

export default function Services({
    auth,
    services
}: PageProps<{ services: LaundryService[] }>) {
    const [activeCategory, setActiveCategory] = useState('Semua');

    const filteredServices = useMemo(() => {
        if (activeCategory === 'Semua') return services;
        if (activeCategory === 'Ekspres') return services.filter(s => s.duration_hours <= 6);
        return services.filter(s => s.type.toLowerCase() === activeCategory.toLowerCase());
    }, [activeCategory, services]);

    return (
        <>
            <Head title="Layanan Kami - Umaklin" />
            <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-100">
                
                {/* Centered Floating Navbar */}
                <div className="fixed top-6 w-full z-50 px-6 flex justify-center">
                    <nav className="bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-full shadow-2xl shadow-slate-200/40 px-6 h-16 flex items-center gap-8 md:gap-12 transition-all duration-300">
                        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                            <img src="/logo.png" alt="Umaklin" className="h-7 w-auto" />
                        </Link>
                        
                        <div className="hidden md:flex gap-8 text-sm font-bold text-slate-500">
                            <Link href="/" className="hover:text-indigo-600 transition-colors">Beranda</Link>
                            <Link href="/services" className="text-indigo-600 font-bold">Layanan</Link>
                            <Link href="#" className="hover:text-indigo-600 transition-colors">Harga</Link>
                        </div>

                        <div className="flex items-center gap-3 md:gap-6 border-l border-slate-100 pl-3 md:pl-6">
                            {auth.user ? (
                                <Link 
                                    href={route('dashboard')} 
                                    className="text-xs font-bold text-indigo-600 uppercase tracking-widest"
                                >
                                    Dasbor
                                </Link>
                            ) : (
                                <>
                                    <Link href={route('login')} className="text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-indigo-600 transition-colors">
                                        Masuk
                                    </Link>
                                    <Link 
                                        href={route('register')} 
                                        className="px-6 py-2.5 bg-indigo-600 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
                                    >
                                        Daftar
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </div>

                {/* Hero Header */}
                <section className="pt-40 pb-20 px-6 bg-slate-50 border-b border-slate-100">
                    <div className="max-w-4xl mx-auto text-center space-y-6">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900">
                            Layanan Perawatan <span className="text-indigo-600">Terbaik.</span>
                        </h1>
                        <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                            Dari cuci harian hingga perawatan tekstil khusus, kami memberikan standar kualitas tertinggi untuk setiap helai pakaian Anda.
                        </p>
                    </div>
                </section>

                {/* Services List */}
                <section className="py-24 px-6">
                    <div className="max-w-7xl mx-auto">
                        
                        {/* Service Categories */}
                        <div className="flex flex-wrap gap-4 mb-16 justify-center">
                            {['Semua', 'Kiloan', 'Satuan', 'Ekspres'].map((cat) => (
                                <button 
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 active:scale-95 ${
                                        activeCategory === cat 
                                        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' 
                                        : 'bg-white text-slate-500 border border-slate-200 hover:border-indigo-200 hover:text-indigo-600'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Services Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredServices && filteredServices.length > 0 ? (
                                filteredServices.map((service) => (
                                    <div key={service.id} className="group bg-white p-8 rounded-[32px] border border-slate-100 hover:border-indigo-200 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] flex flex-col justify-between">
                                        <div className="space-y-6">
                                            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                                {service.type === 'kiloan' ? <WashingMachine className="w-7 h-7" /> : <Shirt className="w-7 h-7" />}
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-2xl font-bold text-slate-900">{service.name}</h3>
                                                <p className="text-slate-500 text-sm leading-relaxed">
                                                    Perawatan intensif dengan teknologi AI untuk hasil yang maksimal dan wangi yang tahan lama.
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Harga mulai</p>
                                                <p className="text-xl font-bold text-indigo-600">
                                                    Rp {service.price_per_kg.toLocaleString()}
                                                    <span className="text-xs text-slate-400 font-medium"> /kg</span>
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg">
                                                <Clock className="w-4 h-4" />
                                                <span className="text-xs font-bold">{service.duration_hours} jam</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full py-20 text-center space-y-4">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                                        <Search className="w-10 h-10" />
                                    </div>
                                    <p className="text-slate-500 font-medium">Belum ada layanan yang tersedia saat ini.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* FAQ / Why Us Mini Section */}
                <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
                    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
                        <div className="space-y-10">
                            <h2 className="text-3xl md:text-4xl font-bold leading-tight">Mengapa Memilih Layanan Kami?</h2>
                            <div className="space-y-8">
                                {[
                                    { icon: ShieldCheck, title: 'Garansi Kebersihan', desc: 'Pencucian ulang gratis jika Anda tidak puas dengan hasilnya.' },
                                    { icon: Droplets, title: 'Bahan Ramah Lingkungan', desc: 'Kami hanya menggunakan deterjen organik yang aman untuk kulit.' },
                                    { icon: Sparkles, title: 'Teknologi AI', desc: 'Analisis kain cerdas untuk menghindari kerusakan serat.' }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-6 group">
                                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white flex-shrink-0 group-hover:bg-indigo-600 transition-colors">
                                            <item.icon className="w-6 h-6" />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-xl font-bold">{item.title}</h4>
                                            <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative group">
                            <div className="absolute -inset-10 bg-indigo-600/20 rounded-full blur-[100px] group-hover:bg-indigo-600/30 transition-all duration-1000" />
                            <img 
                                src="https://images.unsplash.com/photo-1545173168-9f1947eebb7f?q=80&w=1000&auto=format&fit=crop" 
                                alt="Umaklin Quality" 
                                className="relative rounded-[40px] shadow-2xl border border-white/10"
                            />
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-32 px-6 text-center">
                    <div className="max-w-4xl mx-auto space-y-10">
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900">Butuh Layanan Khusus?</h2>
                        <p className="text-lg text-slate-500">Tim kami siap membantu untuk perawatan karpet, gorden, atau kebutuhan bisnis lainnya.</p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link 
                                href={route('register')} 
                                className="w-full sm:w-auto px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg"
                            >
                                Pesan Sekarang
                            </Link>
                            <button className="w-full sm:w-auto px-10 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                                Hubungi Kami <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-12 px-6 border-t border-slate-100">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                        <Link href="/" className="flex items-center gap-2">
                            <img src="/logo.png" alt="Umaklin" className="h-6 w-auto" />
                        </Link>
                        <p className="text-sm text-slate-400">
                            &copy; {new Date().getFullYear()} Umaklin. All rights reserved.
                        </p>
                    </div>
                </footer>

            </div>
        </>
    );
}
