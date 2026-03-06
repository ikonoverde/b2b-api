import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, Lock, ArrowLeft } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import TextInput from '@/Components/TextInput';
import { AuthMobileHeader, AuthDesktopBrandPanel } from '@/Components/AuthBrandPanel';

interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const form = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        form.post('/reset-password');
    }

    return (
        <>
            <Head title="Restablecer Contraseña" />
            <div className="flex min-h-screen flex-col lg:flex-row">
                <AuthMobileHeader />
                <AuthDesktopBrandPanel />

                {/* Right Panel - Reset Password Form */}
                <div className="flex-1 lg:w-[560px] flex items-center justify-center p-8 lg:p-16 bg-[#FAF6F1]">
                    <div className="w-full max-w-[400px] flex flex-col gap-8">
                        {/* Back Link */}
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 text-[#666666] hover:text-[#1A1A1A] font-medium font-[Outfit] transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Volver al inicio de sesión
                        </Link>

                        {/* Header */}
                        <div className="flex flex-col gap-2">
                            <h1 className="text-[32px] font-semibold text-[#1A1A1A] font-[Outfit]">
                                Restablecer Contraseña
                            </h1>
                            <p className="text-base text-[#666666] font-[Outfit]">
                                Ingresa tu nueva contraseña para continuar.
                            </p>
                        </div>

                        {/* Error Messages */}
                        {form.errors.email && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-sm text-red-600 font-[Outfit]">{form.errors.email}</p>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={submit} className="flex flex-col gap-5">
                            <TextInput
                                id="password"
                                label="Nueva Contraseña"
                                type={showPassword ? 'text' : 'password'}
                                value={form.data.password}
                                onChange={(e) => form.setData('password', e.target.value)}
                                placeholder="Mínimo 8 caracteres, letras y números"
                                icon={Lock}
                                disabled={form.processing}
                                error={form.errors.password}
                                required
                                suffix={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#666666]"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                }
                            />

                            <TextInput
                                id="password_confirmation"
                                label="Confirmar Contraseña"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={form.data.password_confirmation}
                                onChange={(e) => form.setData('password_confirmation', e.target.value)}
                                placeholder="Repite tu nueva contraseña"
                                icon={Lock}
                                disabled={form.processing}
                                error={form.errors.password_confirmation}
                                required
                                suffix={
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#666666]"
                                        tabIndex={-1}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                }
                            />

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={form.processing}
                                className="h-12 bg-[#5E7052] text-white font-semibold rounded-lg hover:bg-[#4d5e43] focus:outline-none focus:ring-2 focus:ring-[#5E7052] focus:ring-offset-2 transition-colors disabled:opacity-50 font-[Outfit] mt-2"
                            >
                                {form.processing ? 'Restableciendo...' : 'Restablecer Contraseña'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
