import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import AvatarUpload from '@/Components/AvatarUpload';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { User, Mail, CheckCircle2, Phone, MapPin } from 'lucide-react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const { auth, avatar_url } = usePage().props as any;
    const user = auth.user;

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            address: user.address || '',
            avatar: null as File | null,
            _method: 'PATCH', // Spoof PATCH since we're using multipart/form-data
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Use post with _method: PATCH because PHP/Laravel doesn't support PATCH with multipart/form-data natively
        post(route('profile.update'), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <section className={className}>
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100 shadow-sm">
                        <User className="w-7 h-7 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Informasi Profil</h2>
                        <p className="text-sm font-medium text-slate-500 mt-1">Kelola detail akun dan preferensi identitas Anda.</p>
                    </div>
                </div>
            </header>

            <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Avatar Section */}
                <div className="lg:col-span-4 flex flex-col items-center">
                    <div className="sticky top-8">
                        <AvatarUpload
                            value={data.avatar}
                            currentAvatarUrl={avatar_url}
                            onChange={(file) => setData('avatar', file)}
                        />
                        <div className="mt-6 text-center">
                            <p className="text-sm font-bold text-slate-700">{user.name}</p>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mt-1">{user.role}</p>
                        </div>
                    </div>
                </div>

                {/* Form Fields Section */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {/* Name */}
                        <div className="space-y-2.5">
                            <InputLabel htmlFor="name" value="Nama Lengkap" className="font-black text-[11px] uppercase tracking-wider text-slate-500 ml-1" />
                            <div className="relative group">
                                <TextInput
                                    id="name"
                                    className="block w-full pl-12 bg-slate-50/50 border-slate-200 focus:bg-white transition-all duration-300"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    autoComplete="name"
                                />
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                            </div>
                            <InputError message={errors.name} />
                        </div>

                        {/* Email */}
                        <div className="space-y-2.5">
                            <InputLabel htmlFor="email" value="Alamat Email" className="font-black text-[11px] uppercase tracking-wider text-slate-500 ml-1" />
                            <div className="relative group">
                                <TextInput
                                    id="email"
                                    type="email"
                                    className="block w-full pl-12 bg-slate-50/50 border-slate-200 focus:bg-white transition-all duration-300"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    autoComplete="username"
                                />
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                            </div>
                            <InputError message={errors.email} />
                        </div>

                        {/* Phone */}
                        <div className="space-y-2.5">
                            <InputLabel htmlFor="phone" value="Nomor Telepon" className="font-black text-[11px] uppercase tracking-wider text-slate-500 ml-1" />
                            <div className="relative group">
                                <TextInput
                                    id="phone"
                                    type="tel"
                                    className="block w-full pl-12 bg-slate-50/50 border-slate-200 focus:bg-white transition-all duration-300"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    autoComplete="tel"
                                />
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                            </div>
                            <InputError message={errors.phone} />
                        </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-2.5">
                        <InputLabel htmlFor="address" value="Alamat Lengkap" className="font-black text-[11px] uppercase tracking-wider text-slate-500 ml-1" />
                        <div className="relative group">
                            <textarea
                                id="address"
                                className="block w-full pl-12 pt-3 bg-slate-50/50 border-slate-200 rounded-xl focus:bg-white focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 min-h-[120px]"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                            />
                            <MapPin className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                        </div>
                        <InputError message={errors.address} />
                    </div>

                    {mustVerifyEmail && user.email_verified_at === null && (
                        <div className="bg-amber-50/50 border border-amber-100 p-5 rounded-2xl flex items-start gap-3">
                            <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                                <Mail className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-sm text-amber-900 font-bold">Email Belum Terverifikasi</p>
                                <p className="text-xs text-amber-700 mt-1">
                                    Silakan verifikasi email Anda untuk mengakses semua fitur.
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="ml-1 underline font-black hover:text-amber-900 transition-colors"
                                    >
                                        Kirim ulang link verifikasi.
                                    </Link>
                                </p>
                                {status === 'verification-link-sent' && (
                                    <div className="mt-3 text-xs font-black text-emerald-600 flex items-center gap-2 bg-white/80 w-fit px-3 py-1.5 rounded-full border border-emerald-100">
                                        <CheckCircle2 className="w-3 h-3" />
                                        Link baru telah dikirim!
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-6 pt-4 border-t border-slate-100">
                        <button 
                            disabled={processing}
                            className="px-10 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 active:scale-95 transition-all shadow-xl shadow-indigo-200 disabled:opacity-50 flex items-center gap-2"
                        >
                            {processing ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : null}
                            Simpan Perubahan
                        </button>

                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-out duration-500"
                            enterFrom="opacity-0 translate-x-4"
                            enterTo="opacity-100 translate-x-0"
                            leave="transition ease-in duration-300"
                            leaveTo="opacity-0 translate-x-4"
                        >
                            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
                                <CheckCircle2 className="w-5 h-5" />
                                <span className="text-sm font-black uppercase tracking-tight">Berhasil Disimpan</span>
                            </div>
                        </Transition>
                    </div>
                </div>
            </form>
        </section>
    );
}
