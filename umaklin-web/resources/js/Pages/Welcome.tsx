import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { 
    ArrowRight,
    Clock,
    Droplets,
    MapPin,
    Play,
    ShieldCheck,
    Sparkles,
    Star,
    Zap,
    ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Welcome({
    auth,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    return (
        <>
            <Head title="Umaklin - Layanan Laundry Premium" />
            <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-100">
                
                {/* Centered Floating Navbar */}
                <div className="fixed top-6 w-full z-50 px-6 flex justify-center">
                    <nav className="bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-full shadow-2xl shadow-slate-200/40 px-6 h-16 flex items-center gap-8 md:gap-12 transition-all duration-300">
                        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                            <img src="/logo.png" alt="Umaklin" className="h-7 w-auto" />
                        </Link>
                        
                        <div className="hidden md:flex gap-8 text-sm font-bold text-slate-500">
                            <Link href="/" className="hover:text-indigo-600 transition-colors">Beranda</Link>
                            <Link href={route('services')} className="hover:text-indigo-600 transition-colors">Layanan</Link>
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

                {/* Simple Hero Section */}
                <section className="pt-40 pb-24 px-6">
                    <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold tracking-wide">
                            Laundry Cerdas Masa Depan
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]">
                            Pakaian Bersih Tanpa <br className="hidden md:block" />
                            <span className="text-indigo-600">Perlu Repot.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                            Solusi laundry premium yang menggabungkan presisi teknologi dengan perawatan profesional. Kami menjemput, mencuci, dan mengantar kembali ke depan pintu Anda.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <Link 
                                href={route('register')} 
                                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 text-lg"
                            >
                                Pesan Sekarang
                            </Link>
                            <Link 
                                href={route('services')}
                                className="w-full sm:w-auto px-8 py-4 bg-white text-slate-600 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all text-lg"
                            >
                                Lihat Layanan
                            </Link>
                        </div>
                    </div>
                    
                    {/* Hero Image */}
                    <div className="max-w-6xl mx-auto mt-20 rounded-[40px] overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-1000 delay-300">
                        <img 
                            src="https://images.unsplash.com/photo-1545173168-9f1947eebb7f?q=80&w=2000&auto=format&fit=crop" 
                            alt="Laundry" 
                            className="w-full aspect-[21/9] object-cover"
                        />
                    </div>
                </section>

                {/* Simple Features Section */}
                <section className="py-24 bg-slate-50">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid md:grid-cols-3 gap-12">
                            {[
                                { 
                                    icon: Droplets, 
                                    title: "Pencucian AI", 
                                    desc: "Sistem cerdas kami menyesuaikan siklus pencucian berdasarkan jenis kain pakaian Anda." 
                                },
                                { 
                                    icon: ShieldCheck, 
                                    title: "Perawatan Premium", 
                                    desc: "Deterjen organik dan pelembut terbaik untuk menjaga kualitas serat kain tetap prima." 
                                },
                                { 
                                    icon: Clock, 
                                    title: "Layanan Ekspres", 
                                    desc: "Pakaian bersih, rapi, dan harum siap dalam waktu kurang dari 6 jam." 
                                }
                            ].map((feature, i) => (
                                <div key={i} className="space-y-6">
                                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                                        <feature.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
                                    <p className="text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Minimalist Steps Section */}
                <section className="py-32 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-20 items-center">
                            <div className="space-y-12">
                                <div className="space-y-4">
                                    <h2 className="text-indigo-600 font-bold uppercase tracking-widest text-sm">Langkah Mudah</h2>
                                    <h3 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">Bagaimana Kami Bekerja Untuk Anda.</h3>
                                </div>
                                <div className="space-y-10">
                                    {[
                                        { step: '01', title: 'Pesan melalui Aplikasi', desc: 'Tentukan waktu penjemputan yang sesuai dengan jadwal Anda.' },
                                        { step: '02', title: 'Penjemputan Gratis', desc: 'Tim kami akan menjemput pakaian kotor langsung ke lokasi Anda.' },
                                        { step: '03', title: 'Perawatan Ahli', desc: 'Pakaian dicuci dengan standar premium menggunakan teknologi AI.' },
                                        { step: '04', title: 'Pengantaran Tepat Waktu', desc: 'Pakaian dikembalikan dalam keadaan bersih, rapi, dan harum.' }
                                    ].map((s, i) => (
                                        <div key={i} className="flex gap-6 items-start">
                                            <span className="text-indigo-200 text-3xl font-bold leading-none">{s.step}</span>
                                            <div className="space-y-2">
                                                <h4 className="text-xl font-bold text-slate-900">{s.title}</h4>
                                                <p className="text-slate-500 font-medium">{s.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 bg-indigo-100 rounded-[40px] translate-x-4 translate-y-4 -z-10"></div>
                                <img 
                                    src="https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=1200&auto=format&fit=crop" 
                                    alt="Service" 
                                    className="rounded-[40px] shadow-xl"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Location Section with Map */}
                <section className="py-32 px-6 bg-slate-50">
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-10 order-2 lg:order-1">
                            <div className="space-y-4">
                                <h2 className="text-indigo-600 font-bold uppercase tracking-widest text-sm">Lokasi Kami</h2>
                                <h3 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">Kunjungi Outlet <br /> Utama Kami.</h3>
                            </div>
                            <div className="space-y-8">
                                <div className="flex gap-6 items-start group">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-xl font-bold text-slate-900">Alamat</h4>
                                        <p className="text-slate-500 font-medium leading-relaxed">
                                            Jl. Raya Condet No.11, RT.5/RW.3, Balekambang,<br />
                                            Kec. Kramat jati, Kota Jakarta Timur, <br />
                                            Daerah Khusus Ibukota Jakarta 13530
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-6 items-start group">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                        <Clock className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-xl font-bold text-slate-900">Jam Operasional</h4>
                                        <p className="text-slate-500 font-medium leading-relaxed">
                                            Senin - Minggu: 08:00 - 20:00 WIB
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-6">
                                <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all flex items-center gap-3">
                                    Buka di Google Maps <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="h-[500px] w-full rounded-[40px] overflow-hidden shadow-2xl border-8 border-white order-1 lg:order-2">
                            <iframe 
                                src="https://maps.google.com/maps?q=Jl.%20Raya%20Condet%20No.11,%20Balekambang,%20Kramat%20Jati,%20Jakarta%20Timur&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                                width="100%" 
                                height="100%" 
                                style={{ border: 0 }} 
                                allowFullScreen={true} 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade"
                                className="grayscale hover:grayscale-0 transition-all duration-700"
                            ></iframe>
                        </div>
                    </div>
                </section>

                {/* Simple Testimonial */}
                <section className="py-24 bg-indigo-600 text-white text-center">
                    <div className="max-w-3xl mx-auto px-6 space-y-8">
                        <div className="flex justify-center gap-1">
                            {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-white" />)}
                        </div>
                        <blockquote className="text-2xl md:text-3xl font-medium leading-relaxed italic">
                            "Layanan laundry terbaik yang pernah saya gunakan. Sangat praktis, tepat waktu, dan hasilnya benar-benar memuaskan. Sangat direkomendasikan!"
                        </blockquote>
                        <div className="space-y-1">
                            <p className="text-xl font-bold">Rizky Ramadhan</p>
                            <p className="text-indigo-200 text-sm font-medium">Pelanggan Setia Umaklin</p>
                        </div>
                    </div>
                </section>

                {/* Minimalist CTA */}
                <section className="py-32 px-6 text-center">
                    <div className="max-w-4xl mx-auto bg-slate-900 rounded-[40px] p-12 md:p-20 space-y-10">
                        <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                            Siap Untuk Pakaian Bersih <br className="hidden md:block" /> 
                            Hari Ini?
                        </h2>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link 
                                href={route('register')} 
                                className="w-full sm:w-auto px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all text-lg"
                            >
                                Daftar Gratis
                            </Link>
                            <button className="w-full sm:w-auto px-10 py-4 bg-white/10 text-white border border-white/20 rounded-2xl font-bold hover:bg-white/20 transition-all text-lg backdrop-blur-sm">
                                Tanya Penawaran
                            </button>
                        </div>
                    </div>
                </section>

                {/* Minimalist Footer */}
                <footer className="py-12 px-6 border-t border-slate-100">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                        <Link href="/" className="flex items-center gap-2">
                            <img src="/logo.png" alt="Umaklin" className="h-6 w-auto" />
                        </Link>
                        <div className="flex gap-8 text-sm font-medium text-slate-500">
                            <Link href="#" className="hover:text-indigo-600 transition-colors">Syarat</Link>
                            <Link href="#" className="hover:text-indigo-600 transition-colors">Privasi</Link>
                            <Link href="#" className="hover:text-indigo-600 transition-colors">Bantuan</Link>
                        </div>
                        <div className="flex flex-col items-center md:items-end gap-2">
                            <p className="text-sm font-bold text-slate-900">Umaklin Condet</p>
                            <p className="text-xs text-slate-500 text-center md:text-right">
                                Jl. Raya Condet No.11, Balekambang, <br />
                                Kramat Jati, Jakarta Timur
                            </p>
                        </div>
                        <p className="text-sm text-slate-400">
                            &copy; {new Date().getFullYear()} Umaklin. All rights reserved.
                        </p>
                    </div>
                </footer>

            </div>
        </>
    );
}
