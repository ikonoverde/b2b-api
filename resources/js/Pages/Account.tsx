import { Link, router, usePage } from '@inertiajs/react';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';
import AccountShell from '@/Layouts/AccountShell';
import { formatCurrency } from '@/utils/currency';
import type { CustomerProfile, PageProps } from '@/types';

interface AccountProps {
    profile: CustomerProfile;
}

interface PasswordFormData {
    current_password: string;
    password: string;
    password_confirmation: string;
    [key: string]: string;
}

const EMPTY_PASSWORD_FORM: PasswordFormData = {
    current_password: '',
    password: '',
    password_confirmation: '',
};

export default function Account({ profile }: AccountProps) {
    const { auth, flash } = usePage<PageProps>().props;
    const user = auth.user!;

    return (
        <AccountShell
            title="Mi cuenta"
            eyebrow="Cuenta · Resumen"
            headline={`Hola, ${user.name}`}
            sub="Información de cuenta, descuento mayorista activo y atajos a tu actividad reciente."
            section="overview"
        >
            {flash?.success && (
                <FlashBanner kind="success" message={flash.success} />
            )}

            <ContactBlock user={user} />

            <StatStrip profile={profile} />

            <PasswordSection />

            <SignOutBlock />
        </AccountShell>
    );
}

function ContactBlock({
    user,
}: {
    user: { name: string; email: string; initials: string };
}) {
    return (
        <section aria-labelledby="contact-heading" className="grid grid-cols-1 gap-6 border-b border-[var(--iko-stone-hairline)] pb-10 md:grid-cols-[10rem_1fr] md:items-baseline md:gap-12">
            <h2
                id="contact-heading"
                className="font-spec text-[11px] tracking-[0.12em] text-[var(--iko-stone-whisper)] uppercase"
            >
                Contacto
            </h2>
            <dl className="border-t border-[var(--iko-stone-hairline)]">
                <SpecRow label="Nombre" value={user.name} />
                <SpecRow label="Email" value={user.email} mono />
                <SpecRow label="Iniciales" value={user.initials} mono />
                <div className="flex items-baseline justify-between gap-6 py-3">
                    <span className="font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase">
                        Editar
                    </span>
                    <Link
                        href="/account/profile"
                        className="inline-flex items-baseline gap-2 text-[13px] text-[var(--iko-accent)] hover:text-[var(--iko-accent-hover)]"
                    >
                        Editar perfil
                        <span aria-hidden="true">→</span>
                    </Link>
                </div>
            </dl>
        </section>
    );
}

function StatStrip({ profile }: { profile: CustomerProfile }) {
    return (
        <section
            aria-label="Resumen comercial"
            className="mt-10 grid grid-cols-1 border-y border-[var(--iko-stone-hairline)] sm:grid-cols-3 sm:divide-x sm:divide-[var(--iko-stone-hairline)]"
        >
            <StatItem
                label="Pedidos realizados"
                value={String(profile.orders_count).padStart(2, '0')}
                hint={profile.orders_count === 1 ? 'pedido' : 'pedidos'}
            />
            <StatItem
                label="Total comprado"
                value={formatCurrency(profile.total_spent)}
            />
            <StatItem
                label="Descuento mayorista"
                value={`${profile.discount_percentage ?? 0}%`}
                hint={(profile.discount_percentage ?? 0) === 0 ? 'sin descuentos activos' : 'aplicado al total'}
            />
        </section>
    );
}

function StatItem({ label, value, hint }: { label: string; value: string; hint?: string }) {
    return (
        <div className="flex flex-col gap-2 border-b border-[var(--iko-stone-hairline)] py-7 last:border-b-0 sm:border-b-0 sm:px-8 sm:first:pl-0 sm:last:pr-0">
            <span className="font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase">
                {label}
            </span>
            <span className="font-spec text-[1.75rem] tabular-nums text-[var(--iko-stone-ink)]">
                {value}
            </span>
            {hint && (
                <span className="font-spec text-[11px] tabular-nums tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase">
                    {hint}
                </span>
            )}
        </div>
    );
}

function PasswordSection() {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <section
                aria-labelledby="security-heading"
                className="mt-12 grid grid-cols-1 gap-6 border-b border-[var(--iko-stone-hairline)] pb-10 md:grid-cols-[10rem_1fr] md:items-baseline md:gap-12"
            >
                <h2
                    id="security-heading"
                    className="font-spec text-[11px] tracking-[0.12em] text-[var(--iko-stone-whisper)] uppercase"
                >
                    Seguridad
                </h2>
                <div className="flex flex-col gap-3">
                    <p className="text-[15px] leading-[1.55] text-[var(--iko-stone-ink)]">
                        Cambia tu contraseña periódicamente para mantener tu cuenta segura.
                    </p>
                    <div>
                        <button
                            type="button"
                            onClick={() => setShowModal(true)}
                            className="inline-flex h-11 items-center border border-[var(--iko-stone-hairline)] px-5 text-[13px] text-[var(--iko-stone-ink)] hover:border-[var(--iko-accent)] hover:text-[var(--iko-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]"
                        >
                            Cambiar contraseña
                        </button>
                    </div>
                </div>
            </section>

            {showModal && <PasswordModal onClose={() => setShowModal(false)} />}
        </>
    );
}

function SignOutBlock() {
    function logout(): void {
        router.post('/logout');
    }

    return (
        <section className="mt-12 flex flex-wrap items-center justify-between gap-4 border-y border-[var(--iko-stone-hairline)] py-6">
            <span className="font-spec text-[11px] tracking-[0.12em] text-[var(--iko-stone-whisper)] uppercase">
                Sesión
            </span>
            <button
                type="button"
                onClick={logout}
                className="font-spec text-[12px] tracking-[0.04em] text-[var(--iko-stone-ink)] uppercase hover:text-[var(--iko-error)] transition-colors"
            >
                Cerrar sesión →
            </button>
        </section>
    );
}

function SpecRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
    return (
        <div className="grid grid-cols-[8rem_1fr] items-baseline gap-6 border-b border-[var(--iko-stone-hairline)] py-3 last:border-b-0">
            <dt className="font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase">
                {label}
            </dt>
            <dd
                className={`text-[14px] text-[var(--iko-stone-ink)] ${
                    mono ? 'font-spec tabular-nums' : ''
                }`}
            >
                {value}
            </dd>
        </div>
    );
}

function FlashBanner({ kind, message }: { kind: 'success' | 'error'; message: string }) {
    return (
        <div
            className={`mt-2 border px-5 py-4 text-[13px] leading-relaxed ${
                kind === 'success'
                    ? 'border-[var(--iko-accent)] bg-[var(--iko-accent-soft)] text-[var(--iko-stone-ink)]'
                    : 'border-[var(--iko-error)]/40 bg-[var(--iko-error)]/5 text-[var(--iko-error)]'
            }`}
        >
            {message}
        </div>
    );
}

function PasswordModal({ onClose }: { onClose: () => void }) {
    const [data, setData] = useState<PasswordFormData>(EMPTY_PASSWORD_FORM);
    const [errors, setErrors] = useState<Partial<Record<keyof PasswordFormData, string>>>({});
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState('');

    function handleChange(e: ChangeEvent<HTMLInputElement>): void {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof PasswordFormData]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
        if (success) {
            setSuccess('');
        }
    }

    function submit(e: FormEvent): void {
        e.preventDefault();
        setSubmitting(true);
        setErrors({});

        router.put('/account/password', data, {
            preserveScroll: true,
            onSuccess: () => {
                setSuccess('Contraseña actualizada.');
                setData(EMPTY_PASSWORD_FORM);
                setTimeout(onClose, 1600);
            },
            onError: (validationErrors) => {
                setErrors(validationErrors as Partial<Record<keyof PasswordFormData, string>>);
            },
            onFinish: () => {
                setSubmitting(false);
            },
        });
    }

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="password-modal-heading"
            className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--iko-stone-ink)]/40 p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-[28rem] border border-[var(--iko-stone-hairline)] bg-[var(--iko-stone-paper)] shadow-[0_24px_60px_-20px_rgba(13,38,46,0.25)]"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex items-center justify-between border-b border-[var(--iko-stone-hairline)] px-6 py-5">
                    <h2
                        id="password-modal-heading"
                        className="font-display text-[1.25rem] leading-tight text-[var(--iko-stone-ink)]"
                    >
                        Cambiar contraseña
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-[var(--iko-stone-whisper)] hover:text-[var(--iko-stone-ink)]"
                        aria-label="Cerrar"
                    >
                        <X className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                </header>

                <form onSubmit={submit} className="flex flex-col gap-6 p-6">
                    {success && (
                        <div className="border border-[var(--iko-accent)] bg-[var(--iko-accent-soft)] px-4 py-3 text-[13px] text-[var(--iko-stone-ink)]">
                            {success}
                        </div>
                    )}

                    <PasswordField
                        id="current_password"
                        name="current_password"
                        label="Contraseña actual"
                        value={data.current_password}
                        error={errors.current_password}
                        onChange={handleChange}
                    />
                    <PasswordField
                        id="password"
                        name="password"
                        label="Nueva contraseña"
                        value={data.password}
                        error={errors.password}
                        onChange={handleChange}
                    />
                    <PasswordField
                        id="password_confirmation"
                        name="password_confirmation"
                        label="Confirmar nueva contraseña"
                        value={data.password_confirmation}
                        error={errors.password_confirmation}
                        onChange={handleChange}
                    />

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 border border-[var(--iko-stone-hairline)] py-3 text-[13px] text-[var(--iko-stone-ink)] hover:border-[var(--iko-accent)]"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 bg-[var(--iko-accent)] py-3 text-[13px] font-medium text-[var(--iko-accent-on)] hover:bg-[var(--iko-accent-hover)] disabled:opacity-60"
                        >
                            {submitting ? 'Guardando…' : 'Cambiar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function PasswordField({
    id,
    name,
    label,
    value,
    error,
    onChange,
}: {
    id: string;
    name: string;
    label: string;
    value: string;
    error?: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
    const [visible, setVisible] = useState(false);

    return (
        <div className="flex flex-col gap-2">
            <label
                htmlFor={id}
                className="font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase"
            >
                {label}
            </label>
            <div className="relative">
                <input
                    type={visible ? 'text' : 'password'}
                    id={id}
                    name={name}
                    value={value}
                    onChange={onChange}
                    required
                    className={`h-12 w-full border-b bg-transparent pr-10 font-sans text-[15px] text-[var(--iko-stone-ink)] placeholder:text-[var(--iko-stone-whisper)] focus-visible:border-[var(--iko-accent)] focus-visible:outline-none ${
                        error ? 'border-[var(--iko-error)]' : 'border-[var(--iko-stone-hairline)]'
                    }`}
                    aria-invalid={error ? 'true' : undefined}
                />
                <button
                    type="button"
                    onClick={() => setVisible((v) => !v)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-[var(--iko-stone-whisper)] hover:text-[var(--iko-stone-ink)]"
                    aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                    {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
            </div>
            {error && (
                <span className="font-spec text-[11px] tracking-[0.04em] text-[var(--iko-error)]">
                    {error}
                </span>
            )}
        </div>
    );
}
