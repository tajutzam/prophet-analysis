import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import DeleteUserForm from './Partials/DeleteUserForm';
import { Settings, ShieldCheck, UserCircle, Trash2 } from 'lucide-react';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col">
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
                        Pengaturan <span className="text-indigo-600">Akun</span>
                    </h2>
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-400 mt-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Manajemen informasi dan keamanan akun Anda</span>
                    </div>
                </div>
            }
        >
            <Head title="Pengaturan Profil" />

            <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 space-y-12 pb-24 pt-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                {/* Profile Information Section */}
                <div className="group bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[40px] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)]">
                    <div className="p-8 md:p-12 lg:p-16">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />
                    </div>
                </div>

                {/* Password Security Section */}
                <div className="group bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[40px] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)]">
                    <div className="p-8 md:p-12 lg:p-16">
                        <UpdatePasswordForm />
                    </div>
                </div>

                {/* Danger Zone Section */}
                <div className="group bg-rose-50/30 border border-rose-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[40px] overflow-hidden transition-all duration-500 hover:bg-rose-50/50">
                    <div className="p-8 md:p-12 lg:p-16">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center border border-rose-200 shadow-sm">
                                <Trash2 className="w-7 h-7 text-rose-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-rose-900 tracking-tight">Hapus Akun</h2>
                                <p className="text-sm font-medium text-rose-700 mt-1 italic">Tindakan ini permanen dan tidak dapat dibatalkan.</p>
                            </div>
                        </div>
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>

                {/* Footer Status */}
                <div className="flex flex-col items-center gap-6 pt-12">
                    <div className="flex items-center gap-4 opacity-40">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent to-slate-300"></div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Umaklin Enterprise Security</p>
                        <div className="h-px w-16 bg-gradient-to-l from-transparent to-slate-300"></div>
                    </div>
                    <p className="text-xs font-medium text-slate-400 text-center max-w-md leading-relaxed">
                        Data Anda dienkripsi dan diamankan menggunakan standar industri tertinggi. 
                        Umaklin berkomitmen untuk menjaga privasi dan keamanan setiap pengguna.
                    </p>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
