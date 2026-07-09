import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Daftar" />

            <div className="mb-8">
                <h1 className="text-3xl font-medium text-slate-800 mb-2">Buat Akun Baru</h1>
                <p className="text-sm text-slate-400">Daftarkan akun Anda sebagai pelanggan</p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="name" value="Nama Lengkap" className="font-semibold text-slate-700 mb-2" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full bg-slate-50 border border-slate-100 px-4 py-3 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 rounded-xl"
                        placeholder="Masukkan Nama Lengkap Anda"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" className="font-semibold text-slate-700 mb-2" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full bg-slate-50 border border-slate-100 px-4 py-3 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 rounded-xl"
                        placeholder="Masukkan Alamat Email Anda"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <InputLabel htmlFor="phone" value="Nomor WhatsApp" className="font-semibold text-slate-700 mb-2" />

                        <div className="mt-1 flex rounded-xl bg-slate-50 focus-within:ring-1 focus-within:ring-slate-300 overflow-hidden border border-transparent">
                            <PhoneInput
                                international
                                defaultCountry="ID"
                                value={data.phone}
                                onChange={(value: string | undefined) => setData('phone', value || '')}
                                className="w-full phone-input-container"
                                placeholder="812 3456 7890"
                            />
                        </div>

                        <InputError message={errors.phone} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="address" value="Alamat (Opsional)" className="font-semibold text-slate-700 mb-2" />

                        <TextInput
                            id="address"
                            name="address"
                            value={data.address}
                            className="mt-1 block w-full bg-slate-50 border border-slate-100 px-4 py-3 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 rounded-xl"
                            placeholder="Alamat lengkap Anda"
                            onChange={(e) => setData('address', e.target.value)}
                        />

                        <InputError message={errors.address} className="mt-2" />
                    </div>
                </div>

                <style>{`
                    .phone-input-container {
                        display: flex;
                        align-items: center;
                        width: 100%;
                        padding-left: 1rem;
                    }
                    .phone-input-container .PhoneInputCountry {
                        margin-right: 0.5rem;
                        padding-right: 0.5rem;
                        border-right: 1px solid #e2e8f0;
                    }
                    .phone-input-container input {
                        flex: 1;
                        background: transparent;
                        border: none;
                        padding: 0.75rem 1rem 0.75rem 0;
                        font-size: 0.875rem;
                        outline: none;
                        box-shadow: none;
                    }
                    .phone-input-container input:focus {
                        outline: none;
                        box-shadow: none;
                    }
                `}</style>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <InputLabel htmlFor="password" value="Kata Sandi" className="font-semibold text-slate-700 mb-2" />

                        <div className="relative">
                            <TextInput
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full bg-slate-50 border border-slate-100 px-4 py-3 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 rounded-xl"
                                placeholder="Min. 8 karakter"
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>

                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="password_confirmation"
                            value="Konfirmasi Sandi"
                            className="font-semibold text-slate-700 mb-2"
                        />

                        <div className="relative">
                            <TextInput
                                id="password_confirmation"
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="mt-1 block w-full bg-slate-50 border border-slate-100 px-4 py-3 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 rounded-xl"
                                placeholder="Ketik ulang sandi"
                                autoComplete="new-password"
                                onChange={(e) =>
                                    setData('password_confirmation', e.target.value)
                                }
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>

                        <InputError
                            message={errors.password_confirmation}
                            className="mt-2"
                        />
                    </div>
                </div>

                <div className="pt-4 text-center">
                    <p className="text-sm text-slate-600 mb-6">
                        Sudah punya akun?{' '}
                        <Link href={route('login')} className="text-blue-600 hover:text-blue-700 font-bold underline underline-offset-4 decoration-amber-400">
                            Masuk Ke Akun
                        </Link>
                    </p>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-4 rounded-2xl transition-all duration-200 shadow-xl shadow-blue-200 flex items-center justify-center gap-2"
                    >
                        Buat Akun Sekarang
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
