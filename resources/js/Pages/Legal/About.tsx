import DocumentSheet, {
    ContactList,
    type DocumentContactProps,
    Item,
    List,
    P,
    Section,
    Strong,
} from '@/Components/DocumentSheet';

const UPDATED_AT = '2026-07-18T01:02:35.000Z';

export default function About(contact: DocumentContactProps) {
    return (
        <DocumentSheet
            title="Acerca de Nosotros"
            eyebrow="La marca"
            updatedAt={UPDATED_AT}
            related={[
                { href: '/catalog', label: 'Catálogo' },
                { href: '/faq', label: 'Preguntas frecuentes' },
            ]}
        >
            <Section title="Nuestra Historia">
                <P>
                    Ikonoverde nació con la misión de hacer accesibles productos de cuidado corporal
                    de calidad profesional para cualquier comprador, sin barreras ni cantidades
                    mínimas. Desde nuestros inicios en Yucatán, México, atendemos por igual a spas,
                    hoteles, centros de masaje y a quienes buscan un producto profesional para uso
                    personal.
                </P>
            </Section>

            <Section title="Nuestra Misión">
                <P>
                    Hacer que comprar productos de alta calidad sea fácil, rápido y transparente: el
                    mismo precio para todos, desde una sola unidad, sin trámites.
                </P>
            </Section>

            <Section title="Nuestra Visión">
                <P>
                    Ser la tienda en línea de cuidado corporal de referencia en México, reconocida
                    por la calidad de los productos, la claridad de los precios y una experiencia de
                    compra sin fricciones.
                </P>
            </Section>

            <Section title="¿Por qué Elegirnos?">
                <List>
                    <Item>
                        <Strong>Sin cantidad mínima</Strong>: Compra desde una unidad
                    </Item>
                    <Item>
                        <Strong>Mismo precio para todos</Strong>: Sin tarifas exclusivas ni gates de
                        acceso
                    </Item>
                    <Item>
                        <Strong>Catálogo curado</Strong>: Productos seleccionados, sin relleno
                    </Item>
                    <Item>
                        <Strong>Envío Rápido</Strong>: Entregas eficientes en todo México
                    </Item>
                    <Item>
                        <Strong>Soporte Dedicado</Strong>: Equipo disponible cuando lo necesitas
                    </Item>
                </List>
            </Section>

            <Section title="Contacto">
                <ContactList {...contact} />
            </Section>
        </DocumentSheet>
    );
}
