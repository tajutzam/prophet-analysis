import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen w-full bg-white font-sans">
            {/* Left side: Image & Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-end p-16 text-white overflow-hidden">
                <img 
                    src="https://images.unsplash.com/photo-1545173168-9f1947eebb7f?q=80&w=2000&auto=format&fit=crop" 
                    alt="Background" 
                    className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-blue-900/40 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-900/20 to-transparent" />
                
                <div className="relative z-10 max-w-lg">
                    <div className="flex items-center gap-3 mb-8">
                        <img src="/logo.png" alt="Umaklin Logo" className="h-12 w-auto" />
                    </div>
                    
                    <h2 className="text-4xl font-black tracking-tighter leading-[1.1] mb-6">
                        Layanan Laundry <br />
                        <span className="text-amber-400">Generasi Baru.</span>
                    </h2>
                    
                    <p className="text-lg font-medium leading-relaxed text-slate-300 max-w-sm">
                        Nikmati kemudahan mencuci dengan teknologi analisis cerdas yang memastikan pakaian Anda selalu sempurna.
                    </p>
                </div>

                {/* Subtle AI Decoration */}
                <div className="absolute top-10 right-10 w-64 h-64 border border-white/5 rounded-full" />
                <div className="absolute top-20 right-20 w-32 h-32 border border-white/10 rounded-full" />
            </div>

            {/* Right side: Form Container */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16 lg:p-24 bg-[#FAFAFA]">
                <div className="w-full max-w-md">
                    {children}
                </div>
            </div>
        </div>
    );
}
