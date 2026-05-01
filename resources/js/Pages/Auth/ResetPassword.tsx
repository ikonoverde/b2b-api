import { useState, type FormEvent } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import AuthShell from '@/Layouts/AuthShell';
import TextInput from '@/Components/TextInput';

interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: FormEvent): void => {
        e.preventDefault();
        post('/reset-password');
    };

    return (
        <AuthShell
            title="Nueva contraseña"
            eyebrow="01 · Restablecer"
            headline="Nueva contraseña"
            sub="Elige una contraseña que no hayas usado antes en esta cuenta."
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                <div className="flex flex-col gap-1.5 border-b border-[var(--iko-stone-hairline)] pb-4">
                    <span className="font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase">
                        Cuenta
                    </span>
                    <span className="font-spec text-[14px] text-[var(--iko-stone-ink)] tabular-nums">
                        {email || 'No se proporcionó email'}
                    </span>
                </div>

                <input type="hidden" name="token" value={token} />
                <input type="hidden" name="email" value={email} />

                <div className="flex flex-col gap-6">
                    <TextInput
                        id="password"
                        label="Nueva contraseña"
                        type={showPassword ? 'text' : 'password'}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="Mínimo 8 caracteres"
                        error={errors.password}
                        autoFocus
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
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="h-12 w-full bg-[var(--iko-accent)] px-6 text-[14px] font-medium text-[var(--iko-accent-on)] tracking-[0.01em] hover:bg-[var(--iko-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)] transition-colors disabled:opacity-50"
                >
                    {processing ? 'Restableciendo…' : 'Restablecer contraseña'}
                </button>

                <p className="text-center text-[13px] text-[var(--iko-stone-whisper)]">
                    <Link href="/login" className="font-medium text-[var(--iko-stone-ink)] hover:text-[var(--iko-accent)] transition-colors">
                        ← Volver al inicio de sesión
                    </Link>
                </p>
            </form>
        </AuthShell>
    );
}
