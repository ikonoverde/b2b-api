import { Link, router, usePage } from '@inertiajs/react';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import AccountShell from '@/Layouts/AccountShell';
import TextInput from '@/Components/TextInput';
import { apiFetch } from '@/utils/api';
import type { PageProps } from '@/types';

interface ProfileProps {
    user: {
        id: number;
        name: string;
        email: string;
        phone: string | null;
    };
}

interface ProfileFormData {
    name: string;
    email: string;
    phone: string;
}

export default function Profile({ user }: ProfileProps) {
    const { flash } = usePage<PageProps>().props;
    const [data, setData] = useState<ProfileFormData>({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
    });
    const [errors, setErrors] = useState<Partial<Record<keyof ProfileFormData, string>>>({});
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(flash?.success || '');

    function handleChange(e: ChangeEvent<HTMLInputElement>): void {
        const { id, value } = e.target;
        const field = id as keyof ProfileFormData;
        setData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
        if (success) {
            setSuccess('');
        }
    }

    async function submit(e: FormEvent): Promise<void> {
        e.preventDefault();
        setSubmitting(true);
        setErrors({});
        setSuccess('');

        try {
            const response = await apiFetch('/account/profile', {
                method: 'PUT',
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setSuccess('Perfil actualizado.');
                router.reload({ only: ['user'] });
            } else if (response.status === 422) {
                const body = await response.json();
                setErrors(body.errors || {});
            } else {
                setErrors({ name: 'No fue posible actualizar el perfil.' });
            }
        } catch {
            setErrors({ name: 'Error de conexión. Intenta nuevamente.' });
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <AccountShell
            title="Editar perfil"
            eyebrow="Cuenta · Perfil"
            headline="Editar perfil"
            sub="Mantén tus datos de contacto al día. Estos datos se utilizan para confirmaciones de pedido, envíos y atención comercial."
            section="profile"
        >
            {success && (
                <div className="mb-2 border border-[var(--iko-accent)] bg-[var(--iko-accent-soft)] px-5 py-3 text-[13px] text-[var(--iko-stone-ink)]">
                    {success}
                </div>
            )}
            {flash?.error && (
                <div className="mb-2 border border-[var(--iko-error)]/40 bg-[var(--iko-error)]/5 px-5 py-3 text-[13px] text-[var(--iko-error)]">
                    {flash.error}
                </div>
            )}

            <form onSubmit={submit} className="grid grid-cols-1 gap-12 md:grid-cols-[10rem_1fr] md:gap-16">
                <h2 className="font-spec text-[11px] tracking-[0.12em] text-[var(--iko-stone-whisper)] uppercase">
                    Información personal
                </h2>

                <div className="flex flex-col gap-8">
                    <TextInput
                        id="name"
                        label="Nombre completo"
                        value={data.name}
                        onChange={handleChange}
                        error={errors.name}
                        autoComplete="name"
                        required
                    />
                    <TextInput
                        id="email"
                        label="Email"
                        type="email"
                        value={data.email}
                        onChange={handleChange}
                        error={errors.email}
                        autoComplete="email"
                        required
                    />
                    <TextInput
                        id="phone"
                        label="Teléfono"
                        type="tel"
                        value={data.phone}
                        onChange={handleChange}
                        error={errors.phone}
                        autoComplete="tel"
                        inputMode="tel"
                    />

                    <div className="mt-2 flex flex-wrap gap-3">
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
