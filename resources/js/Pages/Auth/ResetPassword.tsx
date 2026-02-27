import { Head, useForm } from '@inertiajs/react';
import { Eye, EyeOff, Leaf, Lock, CheckCircle } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import TextInput from '@/Components/TextInput';

interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);

    const form = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        
        // Use the API endpoint
        fetch('/api/password/reset/confirm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                token: form.data.token,
                email: form.data.email,
                password: form.data.password,
                password_confirmation: form.data.password_confirmation,
            }),
        })
            .then(async (response) => {
                const data = await response.json();

                if (response.ok) {
                    setResetSuccess(true);
                } else if (response.status === 422) {
                    // Validation errors
                    form.setError(data.errors || {});
                } else {
                    // Other errors (400, etc.)
                    form.setError('email', data.message || 'Error al restablecer la contraseña');
                }
            })
            .catch(() => {
                form.setError('email', 'Error de conexión. Por favor intenta de nuevo.');
            });
    }

    if (resetSuccess) {
        return (
            <>
                <Head title="Contraseña Restablecida" />
                <div className="flex min-h-screen flex-col lg:flex-row">
                    {/* Mobile Header */}
                    <div className="lg:hidden bg-[#5E7052] px-6 py-4">
                        <div className="flex items-center justify-center gap-3">
                            <div className="flex flex-col items-center">
                                <span className="text-white font-[Outfit] font-bold text-lg tracking-wider">
                                    IKONO VERDE
                                </span>
                                <span className="text-[#A8B5A0] font-[Outfit] text-[10px] tracking-widest uppercase">
                                    PROFESIONAL
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Left Panel - Brand (Desktop) */}
                    <div className="hidden lg:flex lg:w-1/2 bg-[#5E7052] flex-col items-center justify-center p-16 relative overflow-hidden">
                        <div className="absolute top-12 left-12 opacity-10">
                            <Leaf className="w-32 h-32 text-white rotate-[-30deg]" />
                        </div>
                        <div className="absolute bottom-16 right-16 opacity-10">
                            <Leaf className="w-24 h-24 text-white rotate-[45deg]" />
                        </div>

                        <div className="flex flex-col items-center gap-6 max-w-[400px] relative z-10">
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-[36px] font-bold text-white font-[Outfit] tracking-wider">
                                    IKONO VERDE
                                </span>
                                <span className="text-[#A8B5A0] font-[Outfit] text-sm tracking-[0.25em] uppercase">
                                    PROFESIONAL
                                </span>
                            </div>
                            <div className="w-16 h-px bg-white/20"></div>
                            <p className="text-lg text-[#A8B5A0] text-center leading-relaxed font-[Outfit]">
                                Portal B2B para Profesionales
                            </p>
                        </div>
                    </div>

                    {/* Right Panel - Success Message */}
                    <div className="flex-1 lg:w-[560px] flex items-center justify-center p-8 lg:p-16 bg-[#FAF6F1]">
                        <div className="w-full max-w-[400px] flex flex-col items-center gap-6 text-center">
                            <div className="w-16 h-16 bg-[#5E7052] rounded-full flex items-center justify-center">
                                <CheckCircle className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <h1 className="text-[32px] font-semibold text-[#1A1A1A] font-[Outfit]">
                                    Contraseña Restablecida
                                </h1>
                                <p className="text-base text-[#666666] font-[Outfit]">
                                    Tu contraseña ha sido actualizada. Vuelve a la app para iniciar sesión.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Restablecer Contraseña" />
            <div className="flex min-h-screen flex-col lg:flex-row">
                {/* Mobile Header */}
                <div className="lg:hidden bg-[#5E7052] px-6 py-4">
                    <div className="flex items-center justify-center gap-3">
                        <div className="flex flex-col items-center">
                            <span className="text-white font-[Outfit] font-bold text-lg tracking-wider">
                                IKONO VERDE
                            </span>
                            <span className="text-[#A8B5A0] font-[Outfit] text-[10px] tracking-widest uppercase">
                                PROFESIONAL
                            </span>
                        </div>
                    </div>
                </div>

                {/* Left Panel - Brand (Desktop) */}
                <div className="hidden lg:flex lg:w-1/2 bg-[#5E7052] flex-col items-center justify-center p-16 relative overflow-hidden">
                    <div className="absolute top-12 left-12 opacity-10">
                        <Leaf className="w-32 h-32 text-white rotate-[-30deg]" />
                    </div>
                    <div className="absolute bottom-16 right-16 opacity-10">
                        <Leaf className="w-24 h-24 text-white rotate-[45deg]" />
                    </div>

                    <div className="flex flex-col items-center gap-6 max-w-[400px] relative z-10">
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-[36px] font-bold text-white font-[Outfit] tracking-wider">
                                IKONO VERDE
                            </span>
                            <span className="text-[#A8B5A0] font-[Outfit] text-sm tracking-[0.25em] uppercase">
                                PROFESIONAL
                            </span>
                        </div>
                        <div className="w-16 h-px bg-white/20"></div>
                        <p className="text-lg text-[#A8B5A0] text-center leading-relaxed font-[Outfit]">
                            Portal B2B para Profesionales
                        </p>
                    </div>
                </div>

                {/* Right Panel - Reset Password Form */}
                <div className="flex-1 lg:w-[560px] flex items-center justify-center p-8 lg:p-16 bg-[#FAF6F1]">
                    <div className="w-full max-w-[400px] flex flex-col gap-8">
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
                            {/* Hidden email field - pre-filled from URL */}
                            <input type="hidden" name="email" value={form.data.email} />

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
