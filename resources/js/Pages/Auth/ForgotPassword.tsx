import { type FormEvent } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { CheckCircle } from 'lucide-react';
import AuthShell from '@/Layouts/AuthShell';
import TextInput from '@/Components/TextInput';

export default function ForgotPassword() {
    const { flash } = usePage() as { props: { flash: { success?: string } } };

    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const handleSubmit = (e: FormEvent): void => {
        e.preventDefault();
        post('/forgot-password');
    };

    return (
        <AuthShell
            title="Restablecer contraseña"
            eyebrow="01 · Recuperación"
            headline="Restablecer contraseña"
            sub="Te enviaremos un enlace al correo asociado a tu cuenta."
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                {flash?.success && (
                    <div className="flex items-start gap-3 border border-[var(--iko-accent)] px-4 py-3 bg-[var(--iko-accent-soft)] text-[var(--iko-stone-ink)]">
                        <CheckCircle className="w-5 h-5 text-[var(--iko-accent)] shrink-0 mt-0.5" />
                        <div>
                            <p className="text-[14px] font-medium">Enlace enviado</p>
                            <p className="text-[13px] text-[var(--iko-stone-whisper)]">{flash.success}</p>
                        </div>
                    </div>
                )}

                <TextInput
                    id="email"
                    label="Email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    placeholder="Ingresa tu email"
                    error={errors.email}
                    autoFocus
                    required
                />

                <button
                    type="submit"
                    disabled={processing}
                    className="h-12 w-full bg-[var(--iko-accent)] px-6 text-[14px] font-medium text-[var(--iko-accent-on)] tracking-[0.01em] hover:bg-[var(--iko-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)] transition-colors disabled:opacity-50"
                >
                    {processing ? 'Enviando…' : 'Enviar enlace'}
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
