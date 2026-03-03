import { Link, usePage } from '@inertiajs/react';
import {
    Bell,
    ChevronLeft,
    Loader2,
} from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import type { PageProps } from '@/types';
import { apiFetch } from '@/utils/api';
import { useState } from 'react';

interface NotificationPreferences {
    notify_order_updates: boolean;
    notify_promotional_emails: boolean;
    notify_newsletter: boolean;
}

interface NotificationsProps {
    preferences: NotificationPreferences;
}

const toggleItems = [
    {
        key: 'notify_order_updates' as const,
        label: 'Actualizaciones de Pedidos',
        description: 'Reciba notificaciones sobre el estado de sus pedidos, envíos y entregas.',
    },
    {
        key: 'notify_promotional_emails' as const,
        label: 'Correos Promocionales',
        description: 'Reciba ofertas especiales, descuentos y promociones exclusivas.',
    },
    {
        key: 'notify_newsletter' as const,
        label: 'Boletín Informativo',
        description: 'Reciba noticias, novedades y contenido relevante de nuestra empresa.',
    },
];

export default function Notifications({ preferences }: NotificationsProps) {
    const { flash } = usePage<PageProps>().props;
    const [formData, setFormData] = useState<NotificationPreferences>({ ...preferences });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState(flash?.success || '');
    const [errorMessage, setErrorMessage] = useState('');

    function handleToggle(key: keyof NotificationPreferences) {
        setFormData(prev => ({ ...prev, [key]: !prev[key] }));
        if (successMessage) {
            setSuccessMessage('');
        }
        if (errorMessage) {
            setErrorMessage('');
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            const response = await apiFetch('/account/notifications', {
                method: 'PUT',
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSuccessMessage('Preferencias de notificación actualizadas exitosamente.');
            } else {
                setErrorMessage('Error al actualizar las preferencias.');
            }
        } catch {
            setErrorMessage('Error de conexión. Por favor intente nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <CustomerLayout title="Notificaciones">
            <div className="px-6 py-8 max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <Link
                        href="/account"
                        className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                        <ChevronLeft className="h-5 w-5 text-[#666666]" />
                    </Link>
                    <h1 className="text-xl font-bold text-[#1A1A1A] font-[Outfit]">Notificaciones</h1>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                        <p className="text-sm text-green-700 font-[Outfit]">{successMessage}</p>
                    </div>
                )}

                {/* Error Message */}
                {(errorMessage || flash?.error) && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-sm text-red-700 font-[Outfit]">{errorMessage || flash?.error}</p>
                    </div>
                )}

                {/* Notification Preferences Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#5E7052]/10">
                                <Bell className="h-6 w-6 text-[#5E7052]" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-[#1A1A1A] font-[Outfit]">Preferencias de Notificación</h2>
                                <p className="text-sm text-[#999999] font-[Outfit]">Elija qué notificaciones desea recibir</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {toggleItems.map((item) => (
                                <label
                                    key={item.key}
                                    className="flex items-start gap-4 p-4 rounded-xl border border-[#E5E5E5] hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={formData[item.key]}
                                        onChange={() => handleToggle(item.key)}
                                        className="mt-0.5 h-5 w-5 rounded border-[#E5E5E5] text-[#5E7052] focus:ring-[#5E7052]/20"
                                    />
                                    <div className="flex-1">
                                        <span className="block text-sm font-medium text-[#1A1A1A] font-[Outfit]">{item.label}</span>
                                        <span className="block text-sm text-[#999999] font-[Outfit] mt-0.5">{item.description}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <Link
                            href="/account"
                            className="flex-1 rounded-xl border border-[#E5E5E5] bg-white px-4 py-3.5 text-center text-sm font-medium text-[#666666] hover:bg-gray-50 transition-colors font-[Outfit]"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 rounded-xl bg-[#5E7052] px-4 py-3.5 text-sm font-bold text-white hover:bg-[#4A5A40] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-[Outfit] flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                'Guardar Cambios'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </CustomerLayout>
    );
}
