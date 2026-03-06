import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { type FormEvent } from 'react';
import TextInput from '@/Components/TextInput';
import { AuthMobileHeader, AuthDesktopBrandPanel } from '@/Components/AuthBrandPanel';

export default function ForgotPassword() {
    const { flash } = usePage<{ flash: { password_status?: string } }>().props;
    const status = flash?.password_status;

    const form = useForm({
        email: '',
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        form.post('/forgot-password', {
            preserveScroll: true,
        });
    }

    if (status === 'sent') {
        return (
            <>
                <Head title="Recuperar Contraseña" />
                <div className="flex min-h-screen flex-col lg:flex-row">
                    <AuthMobileHeader />
                    <AuthDesktopBrandPanel />

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
                                <p className="text-sm text-[#999999] font-[Outfit] mt-2">
                                    Revisa tu bandeja de entrada y haz clic en el enlace del email.
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
                <AuthMobileHeader />
                <AuthDesktopBrandPanel />

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
                                value={form.data.email}
                                onChange={(e) => form.setData('email', e.target.value)}
                                placeholder="Ingresa tu email"
                                icon={Mail}
                                error={form.errors.email}
                                required
                                autoFocus
                            />

                            <button
                                type="submit"
                                disabled={form.processing}
                                className="h-12 bg-[#5E7052] text-white font-semibold rounded-lg hover:bg-[#4d5e43] focus:outline-none focus:ring-2 focus:ring-[#5E7052] focus:ring-offset-2 transition-colors disabled:opacity-50 font-[Outfit] mt-2"
                            >
                                {form.processing ? 'Enviando...' : 'Enviar Enlace'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
