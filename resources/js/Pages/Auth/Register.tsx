import { useState, type FormEvent } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import AuthShell from '@/Layouts/AuthShell';
import TextInput from '@/Components/TextInput';

interface RegisterForm {
    name: string;
    rfc: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
    terms_accepted: boolean;
}

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const { errors: pageErrors } = usePage() as { props: { errors: Record <string, string> } };

    const { data, setData, post, processing, errors } = useForm <RegisterForm>({
        name: '',
        rfc: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        terms_accepted: false,
    });

    const handleSubmit = (e: FormEvent): void => {
        e.preventDefault();
        post('/register');
    };

    return (
        <AuthShell
            title="Crear cuenta"
            eyebrow="01 · Cuenta nueva"
            headline="Crear cuenta"
            sub="Guarda direcciones, repite pedidos en un clic y revisa tu historial cuando quieras."
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                {pageErrors?.google && (
                    <div className="border border-[var(--iko-error)] px-4 py-3 text-[13px] bg-[var(--iko-error)]/5 text-[var(--iko-error)]">
                        {pageErrors.google}
                    </div>
                )}

                <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <TextInput
                            id="name"
                            label="Nombre o razón social"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Tu nombre o empresa"
                            error={errors.name}
                            autoFocus
                            required
                        />
                        <TextInput
                            id="rfc"
                            label="RFC"
                            value={data.rfc}
                            onChange={(e) => setData('rfc', e.target.value.toUpperCase())}
                            placeholder="XAXX010101000"
                            error={errors.rfc}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <TextInput
                            id="email"
                            label="Email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="tu@email.com"
                            error={errors.email}
                            required
                        />
                        <TextInput
                            id="phone"
                            label="Teléfono"
                            type="tel"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            placeholder="55 1234 5678"
                            error={errors.phone}
                            required
                        />
                    </div>

                    <TextInput
                        id="password"
                        label="Contraseña"
                        type={showPassword ? 'text' : 'password'}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="Mínimo 8 caracteres"
                        error={errors.password}
                        required
                        suffix={
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-0 top-1/2 -translate-y-1/2 text-[var(--iko-stone-whisper)] hover:text-[var(--iko-stone-ink)] transition-colors p-2"
                                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        }
                    />

                    <TextInput
                        id="password_confirmation"
                        label="Confirmar contraseña"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        placeholder="Repite tu contraseña"
                        error={errors.password_confirmation}
                        required
                    />

                    <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={data.terms_accepted}
                            onChange={(e) => setData('terms_accepted', e.target.checked)}
                            className="mt-0.5 w-4 h-4 border border-[var(--iko-stone-hairline)] accent-[var(--iko-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]"
                        />
                        <span className="text-[13px] leading-relaxed text-[var(--iko-stone-ink)]">
                            Acepto los{' '}
                            <Link href="/terms" className="underline hover:text-[var(--iko-accent)] transition-colors">Términos de uso</Link>
                            {' '}y la{' '}
                            <Link href="/privacy" className="underline hover:text-[var(--iko-accent)] transition-colors">Política de privacidad</Link>
                            .
                        </span>
                    </label>
                    {errors.terms_accepted && (
                        <span className="mt-1 flex items-center gap-1.5 font-spec text-[11px] text-[var(--iko-error)]">
                            {errors.terms_accepted}
                        </span>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="h-12 w-full bg-[var(--iko-accent)] px-6 text-[14px] font-medium text-[var(--iko-accent-on)] tracking-[0.01em] hover:bg-[var(--iko-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)] transition-colors disabled:opacity-50"
                >
                    {processing ? (
                        <span className="flex items-center justify-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Creando cuenta…
                        </span>
                    ) : (
                        'Crear cuenta'
                    )}
                </button>

                <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-[var(--iko-stone-hairline)]" />
                    <span className="font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase">o continúa con</span>
                    <div className="flex-1 h-px bg-[var(--iko-stone-hairline)]" />
                </div>

                <a
                    href="/auth/google"
                    className="h-12 w-full flex items-center justify-center gap-3 border border-[var(--iko-stone-hairline)] text-[var(--iko-stone-ink)] text-[14px] font-medium hover:bg-[var(--iko-accent-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)] transition-colors"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continuar con Google
                </a>

                <p className="text-center text-[13px] text-[var(--iko-stone-whisper)]">
                    ¿Ya tienes cuenta?{' '}
                    <Link href="/login" className="font-medium text-[var(--iko-stone-ink)] hover:text-[var(--iko-accent)] transition-colors">
                        Iniciar sesión
                    </Link>
                </p>
            </form>
        </AuthShell>
    );
}
