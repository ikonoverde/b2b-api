import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Shield } from 'lucide-react';
import type { PageProps } from '@/types';

export default function Privacy({ auth }: PageProps) {
    return (
        <>
            <Head title="Política de Privacidad" />
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
                                <Shield className="w-7 h-7 text-[#8B6F47]" />
                            </div>
                            <div>
                                <h1 className="font-[Outfit] font-bold text-3xl text-[#1A1A1A]">
                                    Política de Privacidad
                                </h1>
                                <p className="font-[Outfit] text-sm text-[#666666]">
                                    Última actualización: Febrero 2026
                                </p>
                            </div>
                        </div>

                        {/* Privacy Content */}
                        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-8 shadow-sm">
                            <div className="prose prose-stone max-w-none font-[Outfit]">
                                <section className="mb-8">
                                    <h2 className="font-[Outfit] font-semibold text-xl text-[#1A1A1A] mb-4">
                                        1. Información que Recopilamos
                                    </h2>
                                    <p className="text-[#666666] leading-relaxed mb-4">
                                        En Ikonoverde Profesional, recopilamos la siguiente información para
                                        brindarle un mejor servicio:
                                    </p>
                                    <ul className="list-disc pl-6 text-[#666666] leading-relaxed space-y-2">
                                        <li>Información de registro: nombre, correo electrónico, teléfono y datos de la empresa</li>
                                        <li>Información de facturación: dirección fiscal, RFC y datos de pago</li>
                                        <li>Información de envío: direcciones de entrega</li>
                                        <li>Datos de uso: historial de navegación, búsquedas y preferencias dentro de la plataforma</li>
                                        <li>Información técnica: dirección IP, tipo de navegador y dispositivo utilizado</li>
                                    </ul>
                                </section>

                                <section className="mb-8">
                                    <h2 className="font-[Outfit] font-semibold text-xl text-[#1A1A1A] mb-4">
                                        2. Uso de la Información
                                    </h2>
                                    <p className="text-[#666666] leading-relaxed mb-4">
                                        Utilizamos la información recopilada para los siguientes fines:
                                    </p>
                                    <ul className="list-disc pl-6 text-[#666666] leading-relaxed space-y-2">
                                        <li>Procesar y gestionar sus pedidos y entregas</li>
                                        <li>Administrar su cuenta y proporcionar atención al cliente</li>
                                        <li>Enviar comunicaciones sobre pedidos, promociones y actualizaciones del servicio</li>
                                        <li>Mejorar y personalizar su experiencia en la plataforma</li>
                                        <li>Cumplir con obligaciones legales y fiscales</li>
                                    </ul>
                                </section>

                                <section className="mb-8">
                                    <h2 className="font-[Outfit] font-semibold text-xl text-[#1A1A1A] mb-4">
                                        3. Compartir Información
                                    </h2>
                                    <p className="text-[#666666] leading-relaxed mb-4">
                                        No vendemos ni alquilamos su información personal a terceros. Podemos compartir
                                        su información únicamente en los siguientes casos:
                                    </p>
                                    <ul className="list-disc pl-6 text-[#666666] leading-relaxed space-y-2">
                                        <li>Con proveedores de servicios de envío para realizar las entregas</li>
                                        <li>Con procesadores de pago para completar transacciones</li>
                                        <li>Cuando sea requerido por ley o por autoridades competentes</li>
                                        <li>Para proteger los derechos, seguridad o propiedad de Ikonoverde y sus usuarios</li>
                                    </ul>
                                </section>

                                <section className="mb-8">
                                    <h2 className="font-[Outfit] font-semibold text-xl text-[#1A1A1A] mb-4">
                                        4. Seguridad de los Datos
                                    </h2>
                                    <p className="text-[#666666] leading-relaxed mb-4">
                                        Implementamos medidas de seguridad técnicas y organizativas para proteger su
                                        información personal, incluyendo:
                                    </p>
                                    <ul className="list-disc pl-6 text-[#666666] leading-relaxed space-y-2">
                                        <li>Cifrado de datos en tránsito mediante SSL/TLS</li>
                                        <li>Almacenamiento seguro de contraseñas con algoritmos de hash</li>
                                        <li>Acceso restringido a datos personales solo al personal autorizado</li>
                                        <li>Monitoreo continuo de actividad sospechosa en la plataforma</li>
                                    </ul>
                                </section>

                                <section className="mb-8">
                                    <h2 className="font-[Outfit] font-semibold text-xl text-[#1A1A1A] mb-4">
                                        5. Cookies y Tecnologías Similares
                                    </h2>
                                    <p className="text-[#666666] leading-relaxed mb-4">
                                        Utilizamos cookies y tecnologías similares para mejorar su experiencia en la
                                        plataforma. Estas tecnologías nos permiten:
                                    </p>
                                    <ul className="list-disc pl-6 text-[#666666] leading-relaxed space-y-2">
                                        <li>Mantener su sesión activa mientras navega</li>
                                        <li>Recordar sus preferencias y configuraciones</li>
                                        <li>Analizar el uso de la plataforma para mejorar nuestros servicios</li>
                                        <li>Ofrecer contenido y recomendaciones relevantes</li>
                                    </ul>
                                    <p className="text-[#666666] leading-relaxed mt-4">
                                        Puede configurar su navegador para rechazar cookies, aunque esto puede limitar
                                        algunas funcionalidades de la plataforma.
                                    </p>
                                </section>

                                <section className="mb-8">
                                    <h2 className="font-[Outfit] font-semibold text-xl text-[#1A1A1A] mb-4">
                                        6. Derechos del Usuario
                                    </h2>
                                    <p className="text-[#666666] leading-relaxed mb-4">
                                        De acuerdo con la legislación aplicable, usted tiene derecho a:
                                    </p>
                                    <ul className="list-disc pl-6 text-[#666666] leading-relaxed space-y-2">
                                        <li>Acceder a sus datos personales que tenemos almacenados</li>
                                        <li>Solicitar la rectificación de datos incorrectos o incompletos</li>
                                        <li>Solicitar la eliminación de sus datos personales</li>
                                        <li>Oponerse al tratamiento de sus datos para fines específicos</li>
                                        <li>Solicitar la portabilidad de sus datos a otro proveedor</li>
                                    </ul>
                                    <p className="text-[#666666] leading-relaxed mt-4">
                                        Para ejercer cualquiera de estos derechos, puede contactarnos a través de los
                                        medios indicados en la sección de Contacto.
                                    </p>
                                </section>

                                <section className="mb-8">
                                    <h2 className="font-[Outfit] font-semibold text-xl text-[#1A1A1A] mb-4">
                                        7. Retención de Datos
                                    </h2>
                                    <p className="text-[#666666] leading-relaxed mb-4">
                                        Conservamos su información personal durante el tiempo necesario para cumplir con
                                        los fines para los que fue recopilada, incluyendo obligaciones legales, contables
                                        y de reportes. Los criterios para determinar el período de retención incluyen:
                                    </p>
                                    <ul className="list-disc pl-6 text-[#666666] leading-relaxed space-y-2">
                                        <li>La duración de la relación comercial con el usuario</li>
                                        <li>Obligaciones legales de conservación de registros fiscales y comerciales</li>
                                        <li>La necesidad de resolver disputas o hacer cumplir acuerdos</li>
                                    </ul>
                                </section>

                                <section className="mb-8">
                                    <h2 className="font-[Outfit] font-semibold text-xl text-[#1A1A1A] mb-4">
                                        8. Menores de Edad
                                    </h2>
                                    <p className="text-[#666666] leading-relaxed mb-4">
                                        Ikonoverde está dirigida a personas mayores de 18 años. No recopilamos
                                        intencionalmente información de menores de edad. Si descubrimos que hemos
                                        recopilado datos de un menor, procederemos a eliminarlos de manera inmediata.
                                    </p>
                                </section>

                                <section className="mb-8">
                                    <h2 className="font-[Outfit] font-semibold text-xl text-[#1A1A1A] mb-4">
                                        9. Cambios a esta Política
                                    </h2>
                                    <p className="text-[#666666] leading-relaxed mb-4">
                                        Nos reservamos el derecho de actualizar esta Política de Privacidad en cualquier
                                        momento. Los cambios serán publicados en esta página con la fecha de la última
                                        actualización. Le recomendamos revisar esta política periódicamente para estar
                                        informado sobre cómo protegemos su información.
                                    </p>
                                </section>

                                <section className="mb-4">
                                    <h2 className="font-[Outfit] font-semibold text-xl text-[#1A1A1A] mb-4">
                                        10. Contacto
                                    </h2>
                                    <p className="text-[#666666] leading-relaxed mb-4">
                                        Si tiene preguntas o inquietudes sobre esta Política de Privacidad o sobre el
                                        tratamiento de sus datos personales, puede contactarnos a través de:
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
                                href="/terms"
                                className="text-[#5E7052] font-[Outfit] font-medium text-sm hover:underline"
                            >
                                Términos y Condiciones
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
