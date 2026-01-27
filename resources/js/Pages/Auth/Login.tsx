import { useState, FormEvent } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Eye, EyeOff, Leaf } from 'lucide-react';

interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
}

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/admin/login');
    };

    return (
        <>
            <Head title="Login" />
            <div className="flex min-h-screen">
                {/* Left Panel - Brand */}
                <div className="hidden lg:flex lg:w-1/2 bg-[#4A5D4A] flex-col items-center justify-center p-16">
                    <div className="flex flex-col items-center gap-6 max-w-[400px]">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                                <Leaf className="w-6 h-6 text-[#4A5D4A]" />
                            </div>
                            <span className="text-[32px] font-bold text-white font-[Outfit]">
                                Ikonoverde
                            </span>
                        </div>
                        <p className="text-lg text-[#A8B5A0] text-center leading-relaxed font-[Outfit]">
                            Optimiza las operaciones de tu negocio con nuestra plataforma integral de gestion B2B.
                        </p>
                    </div>
                </div>

                {/* Right Panel - Login Form */}
                <div className="w-full lg:w-[560px] flex items-center justify-center p-8 lg:p-16 bg-white">
                    <div className="w-full max-w-[400px] flex flex-col gap-8">
                        {/* Header */}
                        <div className="flex flex-col gap-2">
                            <h1 className="text-[32px] font-semibold text-[#1A1A1A] font-[Outfit]">
                                Bienvenido
                            </h1>
                            <p className="text-base text-[#666666] font-[Outfit]">
                                Ingresa tus credenciales para acceder a tu cuenta
                            </p>
                        </div>

                        {/* Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-5"
                        >
                            {/* Email Field */}
                            <div className="flex flex-col gap-2">
                                <label
                                    htmlFor="email"
                                    className="text-sm font-medium text-[#1A1A1A] font-[Outfit]"
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    placeholder="Ingresa tu email"
                                    className="h-12 px-4 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] placeholder:text-[#999999] focus:outline-none focus:ring-2 focus:ring-[#4A5D4A] focus:border-transparent font-[Outfit]"
                                    required
                                    autoFocus
                                />
                                {errors.email && (
                                    <span className="text-sm text-red-500 font-[Outfit]">
                                        {errors.email}
                                    </span>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="flex flex-col gap-2">
                                <label
                                    htmlFor="password"
                                    className="text-sm font-medium text-[#1A1A1A] font-[Outfit]"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        id="password"
                                        name="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                        placeholder="Ingresa tu password"
                                        className="w-full h-12 px-4 pr-12 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] placeholder:text-[#999999] focus:outline-none focus:ring-2 focus:ring-[#4A5D4A] focus:border-transparent font-[Outfit]"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#666666]"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <span className="text-sm text-red-500 font-[Outfit]">
                                        {errors.password}
                                    </span>
                                )}
                            </div>

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
                                        className="w-5 h-5 rounded border-[#E5E5E5] text-[#4A5D4A] focus:ring-[#4A5D4A]"
                                    />
                                    <span className="text-sm text-[#1A1A1A] font-[Outfit]">
                                        Recordarme
                                    </span>
                                </label>
                                <a
                                    href="#"
                                    className="text-sm font-medium text-[#4A5D4A] hover:underline font-[Outfit]"
                                >
                                    Olvidaste tu password?
                                </a>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-4 mt-4">
                                {/* Sign In Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="h-12 bg-[#4A5D4A] text-white font-semibold rounded-lg hover:bg-[#3d4d3d] focus:outline-none focus:ring-2 focus:ring-[#4A5D4A] focus:ring-offset-2 transition-colors disabled:opacity-50 font-[Outfit]"
                                >
                                    {processing ? 'Ingresando...' : 'Ingresar'}
                                </button>

                                {/* Divider */}
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 h-px bg-[#E5E5E5]"></div>
                                    <span className="text-sm text-[#999999] font-[Outfit]">
                                        o
                                    </span>
                                    <div className="flex-1 h-px bg-[#E5E5E5]"></div>
                                </div>

                                {/* Google Button */}
                                <button
                                    type="button"
                                    className="h-12 flex items-center justify-center gap-3 bg-white border border-[#E5E5E5] rounded-lg font-medium text-[#1A1A1A] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#4A5D4A] focus:ring-offset-2 transition-colors font-[Outfit]"
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
                        <div className="flex items-center justify-center gap-1">
                            <span className="text-sm text-[#666666] font-[Outfit]">
                                No tienes una cuenta?
                            </span>
                            <a
                                href="#"
                                className="text-sm font-semibold text-[#4A5D4A] hover:underline font-[Outfit]"
                            >
                                Registrate
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
