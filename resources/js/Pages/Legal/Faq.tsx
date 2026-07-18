import DocumentSheet, {
    ContactList,
    DocLink,
    type DocumentContactProps,
    Item,
    List,
    P,
    Section,
    Strong,
} from '@/Components/DocumentSheet';

const UPDATED_AT = '2026-06-07T04:25:07.000Z';

export default function Faq(contact: DocumentContactProps) {
    return (
        <DocumentSheet
            title="Preguntas Frecuentes"
            eyebrow="Preguntas frecuentes"
            updatedAt={UPDATED_AT}
            related={[
                { href: '/terms', label: 'Términos y condiciones' },
                { href: '/privacy', label: 'Política de privacidad' },
            ]}
        >
            <Section title="¿Cómo puedo registrarme?">
                <P>
                    Para registrarte en Ikonoverde Profesional, haz clic en el botón "Registrarse" en
                    la página principal. Completa el formulario con tus datos personales y de
                    empresa. Una vez enviado, nuestro equipo revisará tu solicitud y activará tu
                    cuenta.
                </P>
            </Section>

            <Section title="¿Cuáles son los métodos de pago aceptados?">
                <P>Aceptamos los siguientes métodos de pago:</P>
                <List>
                    <Item>Tarjetas de crédito y débito (Visa, Mastercard, AMEX)</Item>
                    <Item>Transferencia bancaria</Item>
                    <Item>Depósito en efectivo</Item>
                </List>
            </Section>

            <Section title="¿Cuánto tiempo tarda en llegar mi pedido?">
                <P>Los tiempos de entrega varían según tu ubicación:</P>
                <List>
                    <Item>
                        <Strong>Zona Metropolitana</Strong>: 1-3 días hábiles
                    </Item>
                    <Item>
                        <Strong>Interior de la República</Strong>: 3-7 días hábiles
                    </Item>
                    <Item>
                        <Strong>Zonas remotas</Strong>: 7-14 días hábiles
                    </Item>
                </List>
            </Section>

            <Section title="¿Puedo hacer devoluciones?">
                <P>
                    Sí, aceptamos devoluciones dentro de los 30 días posteriores a la entrega. El
                    producto debe estar en su empaque original y sin usar. Consulta nuestra sección
                    de <DocLink href="/terms">Términos y Condiciones</DocLink> para más detalles.
                </P>
            </Section>

            <Section title="¿Hay un monto mínimo de compra?">
                <P>No hay un monto mínimo de compra. Puedes comprar desde una unidad.</P>
            </Section>

            <Section title="¿Cómo puedo contactar al soporte?">
                <P>Puedes contactarnos a través de:</P>
                {/* Support channels only — the postal address belongs on /about, not here. */}
                <ContactList
                    {...contact}
                    contactAddress={null}
                    extra={<Item>Chat en vivo disponible en horario laboral</Item>}
                />
            </Section>
        </DocumentSheet>
    );
}
