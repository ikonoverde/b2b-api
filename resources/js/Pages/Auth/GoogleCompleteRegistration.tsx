import { type FormEvent } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import AuthShell from '@/Layouts/AuthShell';
import TextInput from '@/Components/TextInput';

export default function GoogleCompleteRegistration() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        rfc: '',
        phone: '',
        terms_accepted: false,
    });

    const handleSubmit = (e: FormEvent): void => {
        e.preventDefault();
        post('/auth/google/complete-registration');
    };

    return (
        <AuthShell
            title="Completar registro"
            eyebrow="01 · Completar registro"
            headline="Un par de datos más"
            sub="Para terminar de crear tu cuenta necesitamos un par de datos más."
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
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
                        <span className="mt-1 font-spec text-[11px] text-[var(--iko-error)]">
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
                            Guardando…
                        </span>
                    ) : (
                        'Completar registro'
                    )}
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
