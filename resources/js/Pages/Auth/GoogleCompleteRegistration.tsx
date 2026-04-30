import { Head, Link, useForm } from '@inertiajs/react';
import { Briefcase, FileText, Leaf, Loader2, Phone } from 'lucide-react';
import { type FormEvent } from 'react';
import TextInput from '@/Components/TextInput';

interface GoogleCompleteRegistrationProps {
    googleName: string;
    googleEmail: string;
}

export default function GoogleCompleteRegistration({ googleName, googleEmail }: GoogleCompleteRegistrationProps) {
    const form = useForm({
        name: googleName,
        rfc: '',
        phone: '',
        terms_accepted: false,
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        form.post('/auth/google/complete-registration');
    }

    return (
        <>
            <Head title="Completar Registro" />
            <div className="flex min-h-screen flex-col lg:flex-row">
                {/* Mobile Header */}
                <div className="lg:hidden bg-[#5E7052] px-6 py-4">
                    <div className="flex items-center justify-center">
                        <div className="flex flex-col items-center">
                            <span className="text-white font-[Outfit] font-bold text-lg tracking-wider">
                                Ikonoverde
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
                                Ikonoverde
                            </span>
                            <span className="text-[#A8B5A0] font-[Outfit] text-sm tracking-[0.25em] uppercase">
                                PROFESIONAL
                            </span>
                        </div>
                        <div className="w-16 h-px bg-white/20"></div>
                        <p className="text-lg text-[#A8B5A0] text-center leading-relaxed font-[Outfit]">
                            Completa tu perfil para continuar
                        </p>
                    </div>
                </div>

                {/* Right Panel - Complete Registration Form */}
                <div className="flex-1 lg:w-[560px] flex items-center justify-center p-8 lg:p-16 bg-[#FAF6F1]">
                    <div className="w-full max-w-[400px] flex flex-col gap-6">
                        {/* Header */}
                        <div className="flex flex-col gap-2">
                            <h1 className="text-[32px] font-semibold text-[#1A1A1A] font-[Outfit]">
                                Completar Registro
                            </h1>
                            <p className="text-base text-[#666666] font-[Outfit]">
                                Completa los datos de tu negocio para finalizar
                            </p>
                        </div>

                        {/* Google Email Display */}
                        <div className="flex items-center gap-3 bg-white border border-[#E5E5E5] rounded-lg px-4 py-3">
                            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span className="text-sm text-[#666666] font-[Outfit]">{googleEmail}</span>
                        </div>

                        {/* Form */}
                        <form onSubmit={submit} className="flex flex-col gap-4">
                            <TextInput
                                id="name"
                                label="Nombre del Negocio"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                placeholder="Mi Spa & Bienestar"
                                icon={Briefcase}
                                disabled={form.processing}
                                error={form.errors.name}
                            />

                            <TextInput
                                id="rfc"
                                label="RFC de la Empresa"
                                value={form.data.rfc}
                                onChange={(e) => form.setData('rfc', e.target.value.toUpperCase())}
                                placeholder="XAXX010101000"
                                icon={FileText}
                                className="uppercase"
                                disabled={form.processing}
                                error={form.errors.rfc}
                            />

                            <TextInput
                                id="phone"
                                label="Teléfono de Contacto"
                                type="tel"
                                value={form.data.phone}
                                onChange={(e) => form.setData('phone', e.target.value)}
                                placeholder="+52 55 1234 5678"
                                icon={Phone}
                                disabled={form.processing}
                                error={form.errors.phone}
                            />

                            {/* Terms */}
                            <label className="flex items-start gap-3 cursor-pointer mt-1">
                                <input
                                    type="checkbox"
                                    checked={form.data.terms_accepted}
                                    onChange={(e) => form.setData('terms_accepted', e.target.checked)}
                                    className="w-5 h-5 rounded border-[#E5E5E5] text-[#5E7052] focus:ring-[#5E7052] mt-0.5"
                                    disabled={form.processing}
                                />
                                <span className="text-sm text-[#666666] font-[Outfit] leading-relaxed">
                                    Acepto los{' '}
                                    <a href="/terms" className="font-semibold text-[#8B6F47] hover:underline">
                                        Términos y Condiciones
                                    </a>{' '}
                                    y la{' '}
                                    <a href="/privacy" className="font-semibold text-[#8B6F47] hover:underline">
                                        Política de Privacidad
                                    </a>
                                </span>
                            </label>
                            {form.errors.terms_accepted && (
                                <span className="text-sm text-red-500 font-[Outfit]">{form.errors.terms_accepted}</span>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={form.processing}
                                className="h-12 bg-[#5E7052] text-white font-semibold rounded-lg hover:bg-[#4d5e43] focus:outline-none focus:ring-2 focus:ring-[#5E7052] focus:ring-offset-2 transition-colors disabled:opacity-50 font-[Outfit] mt-2"
                            >
                                {form.processing ? (
                                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                                ) : (
                                    'Completar Registro'
                                )}
                            </button>
                        </form>

                        {/* Login Link */}
                        <div className="flex items-center justify-center gap-1">
                            <span className="text-sm text-[#666666] font-[Outfit]">
                                ¿Ya tienes cuenta?
                            </span>
                            <Link
                                href="/login"
                                className="text-sm font-semibold text-[#8B6F47] hover:underline font-[Outfit]"
                            >
                                Inicia sesión
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
