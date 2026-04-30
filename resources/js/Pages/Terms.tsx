import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Scale } from 'lucide-react';
import type { PageProps } from '@/types';

export default function Terms({ auth }: PageProps) {
    return (
        <>
            <Head title="Términos y Condiciones" />
            <div className="min-h-screen bg-[#FAF6F1]">
                {/* Header */}
                <header className="bg-[#5E7052] px-8 py-4">
                    <div className="max-w-6xl mx-auto flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-white font-[Outfit] font-bold text-xl tracking-wider">
                                Ikonoverde
                            </span>
                            <span className="text-[#A8B5A0] font-[Outfit] text-xs tracking-widest uppercase">
                                PROFESIONAL
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            {auth.user ? (
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-2 bg-white text-[#5E7052] px-5 py-2 rounded-lg font-[Outfit] font-semibold text-sm hover:bg-white/90 transition-colors"
                                >
                                    Mi Panel
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="border border-white text-white px-5 py-2 rounded-lg font-[Outfit] font-medium text-sm hover:bg-white/10 transition-colors"
                                    >
                                        Ingresar
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="bg-white text-[#5E7052] px-5 py-2 rounded-lg font-[Outfit] font-semibold text-sm hover:bg-white/90 transition-colors"
                                    >
                                        Registrarse
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="px-8 py-12">
                    <div className="max-w-3xl mx-auto">
                        {/* Back Link */}
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-[#5E7052] font-[Outfit] font-medium text-sm hover:underline mb-8"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Volver al inicio
                        </Link>

                        {/* Page Header */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 rounded-2xl bg-[#E8DDD4] flex items-center justify-center">
                                <Scale className="w-7 h-7 text-[#8B6F47]" />
                            </div>
                            <div>
                                <h1 className="font-[Outfit] font-bold text-3xl text-[#1A1A1A]">
                                    Términos y Condiciones
                                </h1>
                                <p className="font-[Outfit] text-sm text-[#666666]">
                                    Última actualización: Febrero 2026
                                </p>
                            </div>
                        </div>

                        {/* Terms Content */}
                        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-8 shadow-sm">
                            <div className="prose prose-stone max-w-none font-[Outfit]">
                                <section className="mb-8">
                                    <h2 className="font-[Outfit] font-semibold text-xl text-[#1A1A1A] mb-4">
                                        1. Aceptación de los Términos
                                    </h2>
                                    <p className="text-[#666666] leading-relaxed mb-4">
                                        Al acceder y utilizar la plataforma Ikonoverde Profesional, usted acepta quedar
                                        obligado por estos Términos y Condiciones. Si no está de acuerdo con alguna
                                        parte de estos términos, no podrá utilizar nuestros servicios.
                                    </p>
                                </section>

                                <section className="mb-8">
                                    <h2 className="font-[Outfit] font-semibold text-xl text-[#1A1A1A] mb-4">
                                        2. Uso de la Plataforma
                                    </h2>
                                    <p className="text-[#666666] leading-relaxed mb-4">
                                        Ikonoverde Profesional es una plataforma B2B diseñada para profesionales y
                                        empresas del sector. Para utilizar nuestros servicios, debe:
                                    </p>
                                    <ul className="list-disc pl-6 text-[#666666] leading-relaxed space-y-2">
                                        <li>Ser mayor de edad y tener capacidad legal para contratar</li>
                                        <li>Proporcionar información veraz, precisa y completa durante el registro</li>
                                        <li>Mantener la confidencialidad de su cuenta y contraseña</li>
                                        <li>Utilizar la plataforma únicamente para fines lícitos y profesionales</li>
                                    </ul>
                                </section>

                                <section className="mb-8">
                                    <h2 className="font-[Outfit] font-semibold text-xl text-[#1A1A1A] mb-4">
                                        3. Cuenta de Usuario
                                    </h2>
                                    <p className="text-[#666666] leading-relaxed mb-4">
                                        Al crear una cuenta en Ikonoverde Profesional, usted es responsable de:
                                    </p>
                                    <ul className="list-disc pl-6 text-[#666666] leading-relaxed space-y-2">
                                        <li>Proporcionar información precisa y actualizada</li>
                                        <li>Notificar cualquier uso no autorizado de su cuenta</li>
                                        <li>Garantizar que la información de contacto esté siempre actualizada</li>
                                        <li>No compartir sus credenciales de acceso con terceros</li>
                                    </ul>
                                    <p className="text-[#666666] leading-relaxed mt-4">
                                        Nos reservamos el derecho de suspender o terminar cuentas que violen estos
                                        términos o que presenten actividad sospechosa.
                                    </p>
                                </section>

                                <section className="mb-8">
                                    <h2 className="font-[Outfit] font-semibold text-xl text-[#1A1A1A] mb-4">
                                        4. Pedidos y Pagos
                                    </h2>
                                    <p className="text-[#666666] leading-relaxed mb-4">
                                        Los precios mostrados en la plataforma son exclusivos para usuarios
                                        registrados y pueden estar sujetos a cambios sin previo aviso. Al realizar un
                                        pedido:
                                    </p>
                                    <ul className="list-disc pl-6 text-[#666666] leading-relaxed space-y-2">
                                        <li>Los precios mostrados son precios mayoristas exclusivos</li>
                                        <li>Los pedidos están sujetos a disponibilidad de inventario</li>
                                        <li>Los envíos gratuitos aplican a pedidos superiores al monto mínimo especificado</li>
                                        <li>Los tiempos de entrega son estimados y pueden variar según la ubicación</li>
                                    </ul>
                                </section>

                                <section className="mb-8">
                                    <h2 className="font-[Outfit] font-semibold text-xl text-[#1A1A1A] mb-4">
                                        5. Envíos y Entregas
                                    </h2>
                                    <p className="text-[#666666] leading-relaxed mb-4">
                                        Nos comprometemos a procesar y enviar los pedidos en el menor tiempo posible.
                                        Sin embargo, no nos hacemos responsables por:
                                    </p>
                                    <ul className="list-disc pl-6 text-[#666666] leading-relaxed space-y-2">
                                        <li>Retrasos causados por terceros (transportistas, aduanas)</li>
                                        <li>Direcciones de entrega incorrectas proporcionadas por el usuario</li>
                                        <li>Condiciones climáticas o eventos de fuerza mayor</li>
                                        <li>Restricciones de envío a ciertas zonas geográficas</li>
                                    </ul>
                                </section>

                                <section className="mb-8">
                                    <h2 className="font-[Outfit] font-semibold text-xl text-[#1A1A1A] mb-4">
                                        6. Devoluciones y Reembolsos
                                    </h2>
                                    <p className="text-[#666666] leading-relaxed mb-4">
                                        Aceptamos devoluciones de productos en las siguientes condiciones:
                                    </p>
                                    <ul className="list-disc pl-6 text-[#666666] leading-relaxed space-y-2">
                                        <li>El producto debe estar en su empaque original y sin usar</li>
                                        <li>La solicitud de devolución debe realizarse dentro de los 30 días posteriores a la entrega</li>
                                        <li>Los productos personalizados o en oferta especial no son elegibles para devolución</li>
                                        <li>Los costos de envío de devolución pueden ser responsabilidad del cliente</li>
                                    </ul>
                                </section>

                                <section className="mb-8">
                                    <h2 className="font-[Outfit] font-semibold text-xl text-[#1A1A1A] mb-4">
                                        7. Propiedad Intelectual
                                    </h2>
                                    <p className="text-[#666666] leading-relaxed mb-4">
                                        Todo el contenido de la plataforma, incluyendo pero no limitado a logotipos,
                                        imágenes, textos, diseños y código, es propiedad de Ikonoverde o sus
                                        licenciantes y está protegido por leyes de propiedad intelectual. Queda
                                        prohibido:
                                    </p>
                                    <ul className="list-disc pl-6 text-[#666666] leading-relaxed space-y-2">
                                        <li>Copiar, reproducir o distribuir contenido sin autorización</li>
                                        <li>Modificar o crear trabajos derivados del contenido</li>
                                        <li>Utilizar marcas comerciales sin consentimiento expreso</li>
                                        <li>Realizar ingeniería inversa de cualquier parte de la plataforma</li>
                                    </ul>
                                </section>

                                <section className="mb-8">
                                    <h2 className="font-[Outfit] font-semibold text-xl text-[#1A1A1A] mb-4">
                                        8. Limitación de Responsabilidad
                                    </h2>
                                    <p className="text-[#666666] leading-relaxed mb-4">
                                        Ikonoverde no será responsable por daños indirectos, incidentales, especiales,
                                        consecuentes o punitivos que resulten de:
                                    </p>
                                    <ul className="list-disc pl-6 text-[#666666] leading-relaxed space-y-2">
                                        <li>El uso o la imposibilidad de usar la plataforma</li>
                                        <li>Cualquier contenido obtenido de la plataforma</li>
                                        <li>Acceso no autorizado a sus datos o información personal</li>
                                        <li>Errores, virus o malware que puedan afectar su equipo</li>
                                    </ul>
                                </section>

                                <section className="mb-8">
                                    <h2 className="font-[Outfit] font-semibold text-xl text-[#1A1A1A] mb-4">
                                        9. Modificaciones a los Términos
                                    </h2>
                                    <p className="text-[#666666] leading-relaxed mb-4">
                                        Nos reservamos el derecho de modificar estos Términos y Condiciones en
                                        cualquier momento. Los cambios entrarán en vigor inmediatamente después de su
                                        publicación en la plataforma. Es responsabilidad del usuario revisar
                                        periódicamente estos términos. El uso continuado de la plataforma después de
                                        cualquier modificación constituye la aceptación de los nuevos términos.
                                    </p>
                                </section>

                                <section className="mb-8">
                                    <h2 className="font-[Outfit] font-semibold text-xl text-[#1A1A1A] mb-4">
                                        10. Ley Aplicable y Jurisdicción
                                    </h2>
                                    <p className="text-[#666666] leading-relaxed mb-4">
                                        Estos Términos y Condiciones se regirán e interpretarán de acuerdo con las
                                        leyes de los Estados Unidos Mexicanos. Cualquier disputa que surja en relación
                                        con estos términos será sometida a los tribunales competentes de la Ciudad de
                                        México, México.
                                    </p>
                                </section>

                                <section className="mb-4">
                                    <h2 className="font-[Outfit] font-semibold text-xl text-[#1A1A1A] mb-4">
                                        11. Contacto
                                    </h2>
                                    <p className="text-[#666666] leading-relaxed mb-4">
                                        Si tiene alguna pregunta o inquietud sobre estos Términos y Condiciones, puede
                                        contactarnos a través de:
                                    </p>
                                    <ul className="list-none pl-0 text-[#666666] leading-relaxed space-y-2">
                                        <li>Correo electrónico: soporte@ikonoverde.com</li>
                                        <li>Teléfono: +52 (55) 1234-5678</li>
                                        <li>Dirección: Conkal Yucatan, México</li>
                                    </ul>
                                </section>
                            </div>
                        </div>

                        {/* Footer Links */}
                        <div className="mt-8 flex items-center justify-center gap-6">
                            <Link
                                href="/privacy"
                                className="text-[#5E7052] font-[Outfit] font-medium text-sm hover:underline"
                            >
                                Política de Privacidad
                            </Link>
                            <span className="text-[#CCCCCC]">|</span>
                            <Link
                                href="/register"
                                className="text-[#5E7052] font-[Outfit] font-medium text-sm hover:underline"
                            >
                                Crear Cuenta
                            </Link>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t border-[#E5E5E5] py-8 px-8 mt-auto">
                    <div className="max-w-6xl mx-auto flex items-center justify-between">
                        <span className="text-[#999999] font-[Outfit] text-sm">
                            © {new Date().getFullYear()} Ikonoverde. Todos los derechos reservados.
                        </span>
                        <div className="flex items-center gap-4">
                            <Link
                                href="/terms"
                                className="text-[#5E7052] font-[Outfit] text-sm font-medium hover:underline"
                            >
                                Términos
                            </Link>
                            <Link
                                href="/privacy"
                                className="text-[#5E7052] font-[Outfit] text-sm font-medium hover:underline"
                            >
                                Privacidad
                            </Link>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
