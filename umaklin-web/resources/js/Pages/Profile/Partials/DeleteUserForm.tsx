import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';
import { AlertTriangle, Trash2, ShieldAlert } from 'lucide-react';

export default function DeleteUserForm({
    className = '',
}: {
    className?: string;
}) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={className}>
            <div className="bg-rose-50/50 border border-rose-100 p-8 rounded-[32px] max-w-2xl">
                <div className="flex gap-5">
                    <div className="shrink-0">
                        <AlertTriangle className="w-7 h-7 text-rose-600" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-rose-900 leading-relaxed">
                            Setelah akun Anda dihapus, semua sumber daya dan datanya akan dihapus secara permanen. 
                            Harap unduh data apa pun yang ingin Anda simpan sebelum melanjutkan.
                        </p>
                        <button 
                            onClick={confirmUserDeletion}
                            className="mt-8 px-8 py-3.5 bg-rose-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-rose-700 active:scale-95 transition-all shadow-xl shadow-rose-200 flex items-center gap-2"
                        >
                            Hapus Akun Permanen
                        </button>
                    </div>
                </div>
            </div>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-10">
                    <div className="w-20 h-20 bg-rose-100 rounded-[32px] flex items-center justify-center mb-8 mx-auto">
                        <ShieldAlert className="w-10 h-10 text-rose-600" />
                    </div>
                    
                    <h2 className="text-2xl font-black text-slate-900 text-center">
                        Konfirmasi Penghapusan Akun
                    </h2>

                    <p className="mt-4 text-slate-500 font-medium text-center leading-relaxed">
                        Apakah Anda yakin? Harap masukkan kata sandi Anda untuk mengonfirmasi bahwa Anda ingin menghapus akun secara permanen.
                    </p>

                    <div className="mt-10 max-w-sm mx-auto">
                        <InputLabel
                            htmlFor="password"
                            value="Kata Sandi Konfirmasi"
                            className="sr-only"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className="block w-full bg-slate-50 border-slate-200 text-center text-lg py-4 focus:bg-white"
                            isFocused
                            placeholder="Kata Sandi Anda"
                        />

                        <InputError
                            message={errors.password}
                            className="mt-3 text-center"
                        />
                    </div>

                    <div className="mt-12 flex gap-4 max-w-sm mx-auto">
                        <button 
                            type="button"
                            onClick={closeModal}
                            className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                        >
                            Batal
                        </button>

                        <button 
                            className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-700 active:scale-95 transition-all shadow-xl shadow-rose-100"
                            disabled={processing}
                        >
                            {processing ? "Memproses..." : "Ya, Hapus"}
                        </button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
