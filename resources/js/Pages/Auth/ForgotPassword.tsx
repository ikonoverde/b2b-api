import { Head, Link } from '@inertiajs/react';
import { Leaf, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import TextInput from '@/Components/TextInput';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errors, setErrors] = useState<{ email?: string }>({});

    function submit(e: FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        fetch('/api/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ email }),
        })
            .then(async (response) => {
                const data = await response.json();

                if (response.ok) {
                    setIsSuccess(true);
                } else if (response.status === 422) {
                    setErrors(data.errors || {});
                } else {
                    setErrors({ email: data.message || 'Error al enviar el email' });
                }
            })
            .catch(() => {
                setErrors({ email: 'Error de conexión. Por favor intenta de nuevo.' });
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    }

    if (isSuccess) {
        return (
            <>
                <Head title="Recuperar Contraseña" />
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
                                    Email Enviado
                                </h1>
                                <p className="text-base text-[#666666] font-[Outfit]">
                                    Si existe una cuenta con ese email, hemos enviado un enlace para restablecer tu contraseña.
                                </p>
                            </div>
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 text-[#5E7052] font-medium hover:underline font-[Outfit]"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Volver al inicio de sesión
                            </Link>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Recuperar Contraseña" />
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

                {/* Right Panel - Forgot Password Form */}
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
                                Recuperar Contraseña
                            </h1>
                            <p className="text-base text-[#666666] font-[Outfit]">
                                Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={submit} className="flex flex-col gap-5">
                            <TextInput
                                id="email"
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Ingresa tu email"
                                icon={Mail}
                                error={errors.email}
                                required
                                autoFocus
                            />

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="h-12 bg-[#5E7052] text-white font-semibold rounded-lg hover:bg-[#4d5e43] focus:outline-none focus:ring-2 focus:ring-[#5E7052] focus:ring-offset-2 transition-colors disabled:opacity-50 font-[Outfit] mt-2"
                            >
                                {isSubmitting ? 'Enviando...' : 'Enviar Enlace'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
