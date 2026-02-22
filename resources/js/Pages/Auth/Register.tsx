import { Head, Link, useForm } from '@inertiajs/react';
import { Briefcase, Eye, EyeOff, FileText, Leaf, Lock, Loader2, Mail, Phone } from 'lucide-react';
import { useState, type FormEvent } from 'react';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm({
        name: '',
        rfc: '',
        email: '',
        phone: '',
        password: '',
        terms_accepted: false,
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        form.post('/register');
    }

    return (
        <>
            <Head title="Crear Cuenta" />
            <div className="flex min-h-screen flex-col lg:flex-row">
                {/* Mobile Header */}
                <div className="lg:hidden bg-[#5E7052] px-6 py-4">
                    <div className="flex items-center justify-center">
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
                            Únete a nuestra red de profesionales B2B
                        </p>
                    </div>
                </div>

                {/* Right Panel - Register Form */}
                <div className="flex-1 lg:w-[560px] flex items-center justify-center p-8 lg:p-16 bg-[#FAF6F1]">
                    <div className="w-full max-w-[400px] flex flex-col gap-6">
                        {/* Header */}
                        <div className="flex flex-col gap-2">
                            <h1 className="text-[32px] font-semibold text-[#1A1A1A] font-[Outfit]">
                                Crear Cuenta
                            </h1>
                            <p className="text-base text-[#666666] font-[Outfit]">
                                Completa los datos de tu negocio
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={submit} className="flex flex-col gap-4">
                            {/* Business Name */}
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="name" className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                                    Nombre del Negocio
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999999]">
                                        <Briefcase className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        id="name"
                                        value={form.data.name}
                                        onChange={(e) => form.setData('name', e.target.value)}
                                        placeholder="Mi Spa & Bienestar"
                                        className="w-full h-12 pl-12 pr-4 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] placeholder:text-[#999999] focus:outline-none focus:ring-2 focus:ring-[#5E7052] focus:border-transparent font-[Outfit]"
                                        disabled={form.processing}
                                    />
                                </div>
                                {form.errors.name && <span className="text-sm text-red-500 font-[Outfit]">{form.errors.name}</span>}
                            </div>

                            {/* RFC */}
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="rfc" className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                                    RFC de la Empresa
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999999]">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        id="rfc"
                                        value={form.data.rfc}
                                        onChange={(e) => form.setData('rfc', e.target.value.toUpperCase())}
                                        placeholder="XAXX010101000"
                                        className="w-full h-12 pl-12 pr-4 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] placeholder:text-[#999999] focus:outline-none focus:ring-2 focus:ring-[#5E7052] focus:border-transparent font-[Outfit] uppercase"
                                        disabled={form.processing}
                                    />
                                </div>
                                {form.errors.rfc && <span className="text-sm text-red-500 font-[Outfit]">{form.errors.rfc}</span>}
                            </div>

                            {/* Email */}
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="email" className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                                    Correo Electrónico
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999999]">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        value={form.data.email}
                                        onChange={(e) => form.setData('email', e.target.value)}
                                        placeholder="tu@email.com"
                                        className="w-full h-12 pl-12 pr-4 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] placeholder:text-[#999999] focus:outline-none focus:ring-2 focus:ring-[#5E7052] focus:border-transparent font-[Outfit]"
                                        disabled={form.processing}
                                    />
                                </div>
                                {form.errors.email && <span className="text-sm text-red-500 font-[Outfit]">{form.errors.email}</span>}
                            </div>

                            {/* Phone */}
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="phone" className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                                    Teléfono de Contacto
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999999]">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="tel"
                                        id="phone"
                                        value={form.data.phone}
                                        onChange={(e) => form.setData('phone', e.target.value)}
                                        placeholder="+52 55 1234 5678"
                                        className="w-full h-12 pl-12 pr-4 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] placeholder:text-[#999999] focus:outline-none focus:ring-2 focus:ring-[#5E7052] focus:border-transparent font-[Outfit]"
                                        disabled={form.processing}
                                    />
                                </div>
                                {form.errors.phone && <span className="text-sm text-red-500 font-[Outfit]">{form.errors.phone}</span>}
                            </div>

                            {/* Password */}
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="password" className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999999]">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        value={form.data.password}
                                        onChange={(e) => form.setData('password', e.target.value)}
                                        placeholder="Mínimo 8 caracteres"
                                        className="w-full h-12 pl-12 pr-12 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] placeholder:text-[#999999] focus:outline-none focus:ring-2 focus:ring-[#5E7052] focus:border-transparent font-[Outfit]"
                                        disabled={form.processing}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#666666]"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {form.errors.password && <span className="text-sm text-red-500 font-[Outfit]">{form.errors.password}</span>}
                            </div>

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
                                    'Crear Cuenta'
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
