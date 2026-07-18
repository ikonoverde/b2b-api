import DocumentSheet, {
    ContactList,
    type DocumentContactProps,
    Item,
    List,
    P,
    Section,
} from '@/Components/DocumentSheet';

const UPDATED_AT = '2026-06-07T04:25:07.000Z';

export default function Terms(contact: DocumentContactProps) {
    return (
        <DocumentSheet
            title="Términos y Condiciones"
            eyebrow="Documento legal"
            updatedAt={UPDATED_AT}
            related={[
                { href: '/privacy', label: 'Política de privacidad' },
                { href: '/faq', label: 'Preguntas frecuentes' },
            ]}
        >
            <Section title="1. Aceptación de los Términos">
                <P>
                    Al acceder y utilizar la tienda en línea de Ikonoverde, usted acepta quedar
                    obligado por estos Términos y Condiciones. Si no está de acuerdo con alguna parte
                    de estos términos, no podrá utilizar nuestros servicios.
                </P>
            </Section>

            <Section title="2. Uso de la Plataforma">
                <P>
                    Ikonoverde es una tienda en línea de cuidado corporal abierta a profesionales y a
                    particulares por igual. No requerimos cantidad mínima — puede comprar desde una
                    unidad. Para utilizar nuestros servicios, debe:
                </P>
                <List>
                    <Item>Ser mayor de edad y tener capacidad legal para contratar</Item>
                    <Item>
                        Proporcionar información veraz, precisa y completa durante el registro
                    </Item>
                    <Item>Mantener la confidencialidad de su cuenta y contraseña</Item>
                    <Item>Utilizar la plataforma únicamente para fines lícitos</Item>
                </List>
            </Section>

            <Section title="3. Cuenta de Usuario">
                <P>
                    Al crear una cuenta en Ikonoverde Profesional, usted es responsable de:
                </P>
                <List>
                    <Item>Proporcionar información precisa y actualizada</Item>
                    <Item>Notificar cualquier uso no autorizado de su cuenta</Item>
                    <Item>Garantizar que la información de contacto esté siempre actualizada</Item>
                    <Item>No compartir sus credenciales de acceso con terceros</Item>
                </List>
                <P>
                    Nos reservamos el derecho de suspender o terminar cuentas que violen estos
                    términos o que presenten actividad sospechosa.
                </P>
            </Section>

            <Section title="4. Pedidos y Pagos">
                <P>
                    Los precios mostrados en la plataforma aplican por igual a todos los compradores
                    y pueden estar sujetos a cambios sin previo aviso. Al realizar un pedido:
                </P>
                <List>
                    <Item>No requerimos cantidad mínima — puede comprar desde una unidad</Item>
                    <Item>Los pedidos están sujetos a disponibilidad de inventario</Item>
                    <Item>
                        Los tiempos de entrega son estimados y pueden variar según la ubicación
                    </Item>
                </List>
            </Section>

            <Section title="5. Envíos y Entregas">
                <P>
                    Nos comprometemos a procesar y enviar los pedidos en el menor tiempo posible. Sin
                    embargo, no nos hacemos responsables por:
                </P>
                <List>
                    <Item>Retrasos causados por terceros (transportistas, aduanas)</Item>
                    <Item>Direcciones de entrega incorrectas proporcionadas por el usuario</Item>
                    <Item>Condiciones climáticas o eventos de fuerza mayor</Item>
                    <Item>Restricciones de envío a ciertas zonas geográficas</Item>
                </List>
            </Section>

            <Section title="6. Devoluciones y Reembolsos">
                <P>Aceptamos devoluciones de productos en las siguientes condiciones:</P>
                <List>
                    <Item>El producto debe estar en su empaque original y sin usar</Item>
                    <Item>
                        La solicitud de devolución debe realizarse dentro de los 30 días posteriores
                        a la entrega
                    </Item>
                    <Item>
                        Los productos personalizados o en oferta especial no son elegibles para
                        devolución
                    </Item>
                    <Item>
                        Los costos de envío de devolución pueden ser responsabilidad del cliente
                    </Item>
                </List>
            </Section>

            <Section title="7. Propiedad Intelectual">
                <P>
                    Todo el contenido de la plataforma, incluyendo pero no limitado a logotipos,
                    imágenes, textos, diseños y código, es propiedad de Ikonoverde o sus licenciantes
                    y está protegido por leyes de propiedad intelectual. Queda prohibido:
                </P>
                <List>
                    <Item>Copiar, reproducir o distribuir contenido sin autorización</Item>
                    <Item>Modificar o crear trabajos derivados del contenido</Item>
                    <Item>Utilizar marcas comerciales sin consentimiento expreso</Item>
                    <Item>Realizar ingeniería inversa de cualquier parte de la plataforma</Item>
                </List>
            </Section>

            <Section title="8. Limitación de Responsabilidad">
                <P>
                    Ikonoverde no será responsable por daños indirectos, incidentales, especiales,
                    consecuentes o punitivos que resulten de:
                </P>
                <List>
                    <Item>El uso o la imposibilidad de usar la plataforma</Item>
                    <Item>Cualquier contenido obtenido de la plataforma</Item>
                    <Item>Acceso no autorizado a sus datos o información personal</Item>
                    <Item>Errores, virus o malware que puedan afectar su equipo</Item>
                </List>
            </Section>

            <Section title="9. Modificaciones a los Términos">
                <P>
                    Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier
                    momento. Los cambios entrarán en vigor inmediatamente después de su publicación
                    en la plataforma. Es responsabilidad del usuario revisar periódicamente estos
                    términos. El uso continuado de la plataforma después de cualquier modificación
                    constituye la aceptación de los nuevos términos.
                </P>
            </Section>

            <Section title="10. Ley Aplicable y Jurisdicción">
                <P>
                    Estos Términos y Condiciones se regirán e interpretarán de acuerdo con las leyes
                    de los Estados Unidos Mexicanos. Cualquier disputa que surja en relación con
                    estos términos será sometida a los tribunales competentes de la Ciudad de México,
                    México.
                </P>
            </Section>

            <Section title="11. Contacto">
                <P>
                    Si tiene alguna pregunta o inquietud sobre estos Términos y Condiciones, puede
                    contactarnos a través de:
                </P>
                <ContactList {...contact} />
            </Section>
        </DocumentSheet>
    );
}
