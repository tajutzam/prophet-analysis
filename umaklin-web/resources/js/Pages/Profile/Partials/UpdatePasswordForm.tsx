import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { FormEventHandler, useRef, useState } from 'react';
import { Key, CheckCircle2, ShieldCheck, Eye, EyeOff } from 'lucide-react';

export default function UpdatePasswordForm({ className = '' }: { className?: string }) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, errors, put, reset, processing, recentlySuccessful } =
        useForm({
            current_password: '',
            password: '',
            password_confirmation: '',
        });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header className="flex items-center gap-4 mb-10">
                <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-100 shadow-sm">
                    <ShieldCheck className="w-7 h-7 text-amber-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Keamanan Akun</h2>
                    <p className="text-sm font-medium text-slate-500 mt-1">Pastikan akun Anda menggunakan kata sandi yang panjang dan acak agar tetap aman.</p>
                </div>
            </header>

            <form onSubmit={updatePassword} className="max-w-2xl space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {/* Current Password */}
                    <div className="space-y-2.5 md:col-span-2">
                        <InputLabel htmlFor="current_password" value="Kata Sandi Saat Ini" className="font-black text-[11px] uppercase tracking-wider text-slate-500 ml-1" />
                        <div className="relative group">
                            <TextInput
                                id="current_password"
                                ref={currentPasswordInput}
                                value={data.current_password}
                                onChange={(e) => setData('current_password', e.target.value)}
                                type={showCurrentPassword ? 'text' : 'password'}
                                className="block w-full pl-12 pr-12 bg-slate-50/50 border-slate-200 focus:bg-white transition-all duration-300"
                                autoComplete="current-password"
                            />
                            <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-amber-600 transition-colors" />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        <InputError message={errors.current_password} />
                    </div>

                    {/* New Password */}
                    <div className="space-y-2.5">
                        <InputLabel htmlFor="password" value="Kata Sandi Baru" className="font-black text-[11px] uppercase tracking-wider text-slate-500 ml-1" />
                        <div className="relative group">
                            <TextInput
                                id="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                type={showNewPassword ? 'text' : 'password'}
                                className="block w-full pl-12 pr-12 bg-slate-50/50 border-slate-200 focus:bg-white transition-all duration-300"
                                autoComplete="new-password"
                            />
                            <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-amber-600 transition-colors" />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        <InputError message={errors.password} />
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2.5">
                        <InputLabel htmlFor="password_confirmation" value="Konfirmasi Kata Sandi" className="font-black text-[11px] uppercase tracking-wider text-slate-500 ml-1" />
                        <div className="relative group">
                            <TextInput
                                id="password_confirmation"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                type={showConfirmPassword ? 'text' : 'password'}
                                className="block w-full pl-12 pr-12 bg-slate-50/50 border-slate-200 focus:bg-white transition-all duration-300"
                                autoComplete="new-password"
                            />
                            <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-amber-600 transition-colors" />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        <InputError message={errors.password_confirmation} />
                    </div>
                </div>

                <div className="flex items-center gap-6 pt-4 border-t border-slate-100">
                    <button 
                        disabled={processing}
                        className="px-10 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black active:scale-95 transition-all shadow-xl shadow-slate-200 disabled:opacity-50 flex items-center gap-2"
                    >
                        {processing ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : null}
                        Perbarui Kata Sandi
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
                            <span className="text-sm font-black uppercase tracking-tight">Berhasil Diperbarui</span>
                        </div>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
