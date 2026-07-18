import DocumentSheet, {
    ContactList,
    type DocumentContactProps,
    Item,
    List,
    P,
    Section,
} from '@/Components/DocumentSheet';

const UPDATED_AT = '2026-06-07T04:25:07.000Z';

export default function Privacy(contact: DocumentContactProps) {
    return (
        <DocumentSheet
            title="Política de Privacidad"
            eyebrow="Documento legal"
            updatedAt={UPDATED_AT}
            related={[
                { href: '/terms', label: 'Términos y condiciones' },
                { href: '/faq', label: 'Preguntas frecuentes' },
            ]}
        >
            <Section title="1. Información que Recopilamos">
                <P>
                    En Ikonoverde Profesional, recopilamos la siguiente información para brindarle un
                    mejor servicio:
                </P>
                <List>
                    <Item>
                        Información de registro: nombre, correo electrónico, teléfono y datos de la
                        empresa
                    </Item>
                    <Item>Información de facturación: dirección fiscal, RFC y datos de pago</Item>
                    <Item>Información de envío: direcciones de entrega</Item>
                    <Item>
                        Datos de uso: historial de navegación, búsquedas y preferencias dentro de la
                        plataforma
                    </Item>
                    <Item>
                        Información técnica: dirección IP, tipo de navegador y dispositivo utilizado
                    </Item>
                </List>
            </Section>

            <Section title="2. Uso de la Información">
                <P>Utilizamos la información recopilada para los siguientes fines:</P>
                <List>
                    <Item>Procesar y gestionar sus pedidos y entregas</Item>
                    <Item>Administrar su cuenta y proporcionar atención al cliente</Item>
                    <Item>
                        Enviar comunicaciones sobre pedidos, promociones y actualizaciones del
                        servicio
                    </Item>
                    <Item>Mejorar y personalizar su experiencia en la plataforma</Item>
                    <Item>Cumplir con obligaciones legales y fiscales</Item>
                </List>
            </Section>

            <Section title="3. Compartir Información">
                <P>
                    No vendemos ni alquilamos su información personal a terceros. Podemos compartir
                    su información únicamente en los siguientes casos:
                </P>
                <List>
                    <Item>Con proveedores de servicios de envío para realizar las entregas</Item>
                    <Item>Con procesadores de pago para completar transacciones</Item>
                    <Item>Cuando sea requerido por ley o por autoridades competentes</Item>
                    <Item>
                        Para proteger los derechos, seguridad o propiedad de Ikonoverde y sus
                        usuarios
                    </Item>
                </List>
            </Section>

            <Section title="4. Seguridad de los Datos">
                <P>
                    Implementamos medidas de seguridad técnicas y organizativas para proteger su
                    información personal, incluyendo:
                </P>
                <List>
                    <Item>Cifrado de datos en tránsito mediante SSL/TLS</Item>
                    <Item>Almacenamiento seguro de contraseñas con algoritmos de hash</Item>
                    <Item>Acceso restringido a datos personales solo al personal autorizado</Item>
                    <Item>Monitoreo continuo de actividad sospechosa en la plataforma</Item>
                </List>
            </Section>

            <Section title="5. Cookies y Tecnologías Similares">
                <P>
                    Utilizamos cookies y tecnologías similares para mejorar su experiencia en la
                    plataforma. Estas tecnologías nos permiten:
                </P>
                <List>
                    <Item>Mantener su sesión activa mientras navega</Item>
                    <Item>Recordar sus preferencias y configuraciones</Item>
                    <Item>Analizar el uso de la plataforma para mejorar nuestros servicios</Item>
                    <Item>Ofrecer contenido y recomendaciones relevantes</Item>
                </List>
                <P>
                    Puede configurar su navegador para rechazar cookies, aunque esto puede limitar
                    algunas funcionalidades de la plataforma.
                </P>
            </Section>

            <Section title="6. Derechos del Usuario">
                <P>De acuerdo con la legislación aplicable, usted tiene derecho a:</P>
                <List>
                    <Item>Acceder a sus datos personales que tenemos almacenados</Item>
                    <Item>Solicitar la rectificación de datos incorrectos o incompletos</Item>
                    <Item>Solicitar la eliminación de sus datos personales</Item>
                    <Item>Oponerse al tratamiento de sus datos para fines específicos</Item>
                    <Item>Solicitar la portabilidad de sus datos a otro proveedor</Item>
                </List>
                <P>
                    Para ejercer cualquiera de estos derechos, puede contactarnos a través de los
                    medios indicados en la sección de Contacto.
                </P>
            </Section>

            <Section title="7. Retención de Datos">
                <P>
                    Conservamos su información personal durante el tiempo necesario para cumplir con
                    los fines para los que fue recopilada, incluyendo obligaciones legales, contables
                    y de reportes. Los criterios para determinar el período de retención incluyen:
                </P>
                <List>
                    <Item>La duración de la relación comercial con el usuario</Item>
                    <Item>
                        Obligaciones legales de conservación de registros fiscales y comerciales
                    </Item>
                    <Item>La necesidad de resolver disputas o hacer cumplir acuerdos</Item>
                </List>
            </Section>

            <Section title="8. Menores de Edad">
                <P>
                    Ikonoverde está dirigida a personas mayores de 18 años. No recopilamos
                    intencionalmente información de menores de edad. Si descubrimos que hemos
                    recopilado datos de un menor, procederemos a eliminarlos de manera inmediata.
                </P>
            </Section>

            <Section title="9. Cambios a esta Política">
                <P>
                    Nos reservamos el derecho de actualizar esta Política de Privacidad en cualquier
                    momento. Los cambios serán publicados en esta página con la fecha de la última
                    actualización. Le recomendamos revisar esta política periódicamente para estar
                    informado sobre cómo protegemos su información.
                </P>
            </Section>

            <Section title="10. Contacto">
                <P>
                    Si tiene preguntas o inquietudes sobre esta Política de Privacidad o sobre el
                    tratamiento de sus datos personales, puede contactarnos a través de:
                </P>
                <ContactList {...contact} />
            </Section>
        </DocumentSheet>
    );
}
