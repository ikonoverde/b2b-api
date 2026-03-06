import { useState, FormEvent } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Eye, EyeOff, Leaf, Mail, Lock } from 'lucide-react';
import TextInput from '@/Components/TextInput';

interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
}

interface LoginProps {
    postUrl?: string;
    registerUrl?: string | null;
}

export default function Login({ postUrl = '/login', registerUrl = '/register' }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);
    const { flash } = usePage<{ flash: { success?: string } }>().props;

    const { data, setData, post, processing, errors } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(postUrl);
    };

    return (
        <>
            <Head title="Iniciar Sesión" />
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
                    {/* Decorative leaf elements */}
                    <div className="absolute top-12 left-12 opacity-10">
                        <Leaf className="w-32 h-32 text-white rotate-[-30deg]" />
                    </div>
                    <div className="absolute bottom-16 right-16 opacity-10">
                        <Leaf className="w-24 h-24 text-white rotate-[45deg]" />
                    </div>
                    <div className="absolute top-1/3 right-12 opacity-[0.06]">
                        <Leaf className="w-16 h-16 text-white rotate-[120deg]" />
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

                {/* Right Panel - Login Form */}
                <div className="flex-1 lg:w-[560px] flex items-center justify-center p-8 lg:p-16 bg-[#FAF6F1]">
                    <div className="w-full max-w-[400px] flex flex-col gap-8">
                        {/* Flash Messages */}
                        {flash?.success && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <p className="text-sm text-green-700 font-[Outfit]">{flash.success}</p>
                            </div>
                        )}

                        {/* Header */}
                        <div className="flex flex-col gap-2">
                            <h1 className="text-[32px] font-semibold text-[#1A1A1A] font-[Outfit]">
                                Iniciar Sesión
                            </h1>
                            <p className="text-base text-[#666666] font-[Outfit]">
                                Ingresa tus credenciales para acceder
                            </p>
                        </div>

                        {/* Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-5"
                        >
                            <TextInput
                                id="email"
                                label="Email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="Ingresa tu email"
                                icon={Mail}
                                error={errors.email}
                                required
                                autoFocus
                            />

                            <TextInput
                                id="password"
                                label="Contraseña"
                                type={showPassword ? 'text' : 'password'}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Ingresa tu contraseña"
                                icon={Lock}
                                error={errors.password}
                                required
                                suffix={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#666666]"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                }
                            />

                            {/* Options Row */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData('remember', e.target.checked)
                                        }
                                        className="w-5 h-5 rounded border-[#E5E5E5] text-[#5E7052] focus:ring-[#5E7052]"
                                    />
                                    <span className="text-sm text-[#1A1A1A] font-[Outfit]">
                                        Recordarme
                                    </span>
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm font-medium text-[#5E7052] hover:underline font-[Outfit]"
                                >
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-4 mt-4">
                                {/* Sign In Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="h-12 bg-[#5E7052] text-white font-semibold rounded-lg hover:bg-[#4d5e43] focus:outline-none focus:ring-2 focus:ring-[#5E7052] focus:ring-offset-2 transition-colors disabled:opacity-50 font-[Outfit]"
                                >
                                    {processing ? 'Ingresando...' : 'Ingresar'}
                                </button>

                                {/* Divider */}
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 h-px bg-[#E5E5E5]"></div>
                                    <span className="text-sm text-[#999999] font-[Outfit]">
                                        o continúa con
                                    </span>
                                    <div className="flex-1 h-px bg-[#E5E5E5]"></div>
                                </div>

                                {/* Google Button */}
                                <button
                                    type="button"
                                    className="h-12 flex items-center justify-center gap-3 bg-white border border-[#E5E5E5] rounded-lg font-medium text-[#1A1A1A] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#5E7052] focus:ring-offset-2 transition-colors font-[Outfit]"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            fill="#4285F4"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="#34A853"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="#FBBC05"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        />
                                        <path
                                            fill="#EA4335"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        />
                                    </svg>
                                    Continuar con Google
                                </button>
                            </div>
                        </form>

                        {/* Sign Up Link */}
                        {registerUrl && (
                            <div className="flex items-center justify-center gap-1">
                                <span className="text-sm text-[#666666] font-[Outfit]">
                                    ¿No tienes cuenta?
                                </span>
                                <Link
                                    href={registerUrl}
                                    className="text-sm font-semibold text-[#8B6F47] hover:underline font-[Outfit]"
                                >
                                    Regístrate aquí
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
