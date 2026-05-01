import { Link, usePage } from '@inertiajs/react';
import { useState, type FormEvent } from 'react';
import AccountShell from '@/Layouts/AccountShell';
import { apiFetch } from '@/utils/api';
import type { PageProps } from '@/types';

interface NotificationPreferences {
    notify_order_updates: boolean;
    notify_promotional_emails: boolean;
    notify_newsletter: boolean;
}

interface NotificationsProps {
    preferences: NotificationPreferences;
}

interface ToggleItem {
    key: keyof NotificationPreferences;
    eyebrow: string;
    label: string;
    description: string;
}

const TOGGLE_ITEMS: ToggleItem[] = [
    {
        key: 'notify_order_updates',
        eyebrow: '01',
        label: 'Actualizaciones de pedidos',
        description:
            'Confirmaciones, cambios de estado, envío y entrega. Es la única categoría que afecta tus pedidos directamente.',
    },
    {
        key: 'notify_promotional_emails',
        eyebrow: '02',
        label: 'Promociones',
        description:
            'Avisos de ofertas mayoristas, cierres de mes y descuentos por volumen. Bajo volumen, sin spam.',
    },
    {
        key: 'notify_newsletter',
        eyebrow: '03',
        label: 'Boletín',
        description:
            'Notas sobre nuevas formulaciones, formatos y cambios en el catálogo. Mensual.',
    },
];

export default function Notifications({ preferences }: NotificationsProps) {
    const { flash } = usePage<PageProps>().props;
    const [data, setData] = useState<NotificationPreferences>({ ...preferences });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(flash?.success || '');
    const [error, setError] = useState('');

    function toggle(key: keyof NotificationPreferences): void {
        setData((prev) => ({ ...prev, [key]: !prev[key] }));
        if (success) {
            setSuccess('');
        }
        if (error) {
            setError('');
        }
    }

    async function submit(e: FormEvent): Promise<void> {
        e.preventDefault();
        setSubmitting(true);
        setSuccess('');
        setError('');

        try {
            const response = await apiFetch('/account/notifications', {
                method: 'PUT',
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setSuccess('Preferencias actualizadas.');
            } else {
                setError('No fue posible actualizar las preferencias.');
            }
        } catch {
            setError('Error de conexión. Intenta nuevamente.');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <AccountShell
            title="Notificaciones"
            eyebrow="Cuenta · Notificaciones"
            headline="Notificaciones"
            sub="Decide qué correos recibir. Las actualizaciones de pedidos están encendidas por defecto y se recomienda mantenerlas activas."
            section="notifications"
        >
            {success && (
                <div className="mb-2 border border-[var(--iko-accent)] bg-[var(--iko-accent-soft)] px-5 py-3 text-[13px] text-[var(--iko-stone-ink)]">
                    {success}
                </div>
            )}
            {(error || flash?.error) && (
                <div className="mb-2 border border-[var(--iko-error)]/40 bg-[var(--iko-error)]/5 px-5 py-3 text-[13px] text-[var(--iko-error)]">
                    {error || flash?.error}
                </div>
            )}

            <form onSubmit={submit} className="grid grid-cols-1 gap-12 md:grid-cols-[10rem_1fr] md:gap-16">
                <h2 className="font-spec text-[11px] tracking-[0.12em] text-[var(--iko-stone-whisper)] uppercase">
                    Preferencias
                </h2>

                <div className="flex flex-col gap-2">
                    <ol className="border-y border-[var(--iko-stone-hairline)]">
                        {TOGGLE_ITEMS.map((item) => (
                            <ToggleRow
                                key={item.key}
                                item={item}
                                checked={data[item.key]}
                                onToggle={() => toggle(item.key)}
                            />
                        ))}
                    </ol>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex h-12 items-center bg-[var(--iko-accent)] px-7 text-[14px] font-medium tracking-[0.01em] text-[var(--iko-accent-on)] hover:bg-[var(--iko-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {submitting ? 'Guardando…' : 'Guardar cambios'}
                        </button>
                        <Link
                            href="/account"
                            className="inline-flex h-12 items-center border border-[var(--iko-stone-hairline)] px-7 text-[14px] text-[var(--iko-stone-ink)] hover:border-[var(--iko-accent)] hover:text-[var(--iko-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]"
                        >
                            Cancelar
                        </Link>
                    </div>
                </div>
            </form>
        </AccountShell>
    );
}

function ToggleRow({
    item,
    checked,
    onToggle,
}: {
    item: ToggleItem;
    checked: boolean;
    onToggle: () => void;
}) {
    return (
        <li className="grid grid-cols-[2.5rem_1fr_auto] items-start gap-4 border-b border-[var(--iko-stone-hairline)] py-6 last:border-b-0 sm:grid-cols-[3rem_1fr_auto] sm:gap-6">
            <span className="font-spec text-[11px] tabular-nums text-[var(--iko-stone-mid)]">
                {item.eyebrow}
            </span>
            <div className="flex flex-col gap-1.5">
                <label
                    htmlFor={`toggle-${item.key}`}
                    className="font-display text-[1.125rem] leading-tight text-[var(--iko-stone-ink)]"
                >
                    {item.label}
                </label>
                <p className="max-w-[58ch] text-[13px] leading-[1.55] text-[var(--iko-stone-whisper)]">
                    {item.description}
                </p>
            </div>
            <Toggle id={`toggle-${item.key}`} checked={checked} onChange={onToggle} />
        </li>
    );
}

function Toggle({
    id,
    checked,
    onChange,
}: {
    id: string;
    checked: boolean;
    onChange: () => void;
}) {
    return (
        <button
            type="button"
            id={id}
            role="switch"
            aria-checked={checked}
            onClick={onChange}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)] ${
                checked
                    ? 'border-[var(--iko-accent)] bg-[var(--iko-accent)]'
                    : 'border-[var(--iko-stone-hairline)] bg-[var(--iko-stone-paper)]'
            }`}
        >
            <span
                aria-hidden="true"
                className={`inline-block h-4 w-4 bg-[var(--iko-accent-on)] transition-transform ${
                    checked
                        ? 'translate-x-[1.375rem]'
                        : 'translate-x-[0.125rem] bg-[var(--iko-stone-mid)]'
                }`}
            />
        </button>
    );
}
