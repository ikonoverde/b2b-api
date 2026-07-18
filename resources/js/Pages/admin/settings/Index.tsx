import { useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import type { PageProps } from '@/types';

interface Settings {
    contact_email: string | null;
    contact_phone: string | null;
    contact_address: string | null;
}

interface Props extends PageProps {
    settings: Settings;
}

export default function SettingsIndex() {
    const { settings, flash } = usePage<Props>().props;

    const form = useForm({
        contact_email: settings.contact_email ?? '',
        contact_phone: settings.contact_phone ?? '',
        contact_address: settings.contact_address ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.put('/admin/settings', { preserveScroll: true });
    };

    return (
        <AppLayout title="Configuración" active="settings">
            <div className="p-8">
                <div className="max-w-2xl">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-foreground">
                            Configuración
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Información de contacto de la empresa
                        </p>
                    </div>

                    {flash?.success && (
                        <div className="mb-6 bg-primary/10 border border-primary/20 text-primary px-4 py-3 rounded-lg text-sm">
                            {flash.success}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="bg-card rounded-xl border border-border p-6 flex flex-col gap-4"
                    >
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Correo electrónico
                            </label>
                            <input
                                type="email"
                                value={form.data.contact_email}
                                onChange={(e) => form.setData('contact_email', e.target.value)}
                                className="w-full border border-border rounded-lg px-3 py-2 text-sm"
                                placeholder="contacto@ejemplo.com"
                            />
                            {form.errors.contact_email && (
                                <p className="text-destructive text-xs mt-1">{form.errors.contact_email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Teléfono
                            </label>
                            <input
                                type="tel"
                                value={form.data.contact_phone}
                                onChange={(e) => form.setData('contact_phone', e.target.value)}
                                className="w-full border border-border rounded-lg px-3 py-2 text-sm"
                                placeholder="999 123 4567"
                            />
                            {form.errors.contact_phone && (
                                <p className="text-destructive text-xs mt-1">{form.errors.contact_phone}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Dirección
                            </label>
                            <textarea
                                rows={4}
                                value={form.data.contact_address}
                                onChange={(e) => form.setData('contact_address', e.target.value)}
                                className="w-full border border-border rounded-lg px-3 py-2 text-sm resize-y"
                                placeholder="Calle, número, colonia, ciudad, estado, código postal"
                            />
                            {form.errors.contact_address && (
                                <p className="text-destructive text-xs mt-1">{form.errors.contact_address}</p>
                            )}
                        </div>

                        <div className="flex justify-end mt-2">
                            <button
                                type="submit"
                                disabled={form.processing}
                                className="bg-primary text-white px-6 py-2 rounded-lg font-medium text-sm hover:bg-primary disabled:opacity-50 cursor-pointer"
                            >
                                {form.processing ? 'Guardando...' : 'Guardar cambios'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
