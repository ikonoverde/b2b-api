<?php

namespace Database\Seeders;

use App\Models\StaticPage;
use Illuminate\Database\Seeder;

class StaticPageSeeder extends Seeder
{
    public function run(): void
    {
        StaticPage::updateOrCreate(
            ['slug' => 'terms'],
            [
                'title' => 'Términos y Condiciones',
                'content' => $this->termsContent(),
                'is_published' => true,
            ]
        );

        StaticPage::updateOrCreate(
            ['slug' => 'privacy'],
            [
                'title' => 'Política de Privacidad',
                'content' => $this->privacyContent(),
                'is_published' => true,
            ]
        );

        StaticPage::updateOrCreate(
            ['slug' => 'about'],
            [
                'title' => 'Acerca de Nosotros',
                'content' => $this->aboutContent(),
                'is_published' => true,
            ]
        );

        StaticPage::updateOrCreate(
            ['slug' => 'faq'],
            [
                'title' => 'Preguntas Frecuentes',
                'content' => $this->faqContent(),
                'is_published' => true,
            ]
        );
    }

    private function termsContent(): string
    {
        return <<<'MD'
## 1. Aceptación de los Términos

Al acceder y utilizar la plataforma Ikono Verde Profesional, usted acepta quedar obligado por estos Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos, no podrá utilizar nuestros servicios.

## 2. Uso de la Plataforma

Ikono Verde Profesional es una plataforma B2B diseñada para profesionales y empresas del sector. Para utilizar nuestros servicios, debe:

- Ser mayor de edad y tener capacidad legal para contratar
- Proporcionar información veraz, precisa y completa durante el registro
- Mantener la confidencialidad de su cuenta y contraseña
- Utilizar la plataforma únicamente para fines lícitos y profesionales

## 3. Cuenta de Usuario

Al crear una cuenta en Ikono Verde Profesional, usted es responsable de:

- Proporcionar información precisa y actualizada
- Notificar cualquier uso no autorizado de su cuenta
- Garantizar que la información de contacto esté siempre actualizada
- No compartir sus credenciales de acceso con terceros

Nos reservamos el derecho de suspender o terminar cuentas que violen estos términos o que presenten actividad sospechosa.

## 4. Pedidos y Pagos

Los precios mostrados en la plataforma son exclusivos para usuarios registrados y pueden estar sujetos a cambios sin previo aviso. Al realizar un pedido:

- Los precios mostrados son precios mayoristas exclusivos
- Los pedidos están sujetos a disponibilidad de inventario
- Los envíos gratuitos aplican a pedidos superiores al monto mínimo especificado
- Los tiempos de entrega son estimados y pueden variar según la ubicación

## 5. Envíos y Entregas

Nos comprometemos a procesar y enviar los pedidos en el menor tiempo posible. Sin embargo, no nos hacemos responsables por:

- Retrasos causados por terceros (transportistas, aduanas)
- Direcciones de entrega incorrectas proporcionadas por el usuario
- Condiciones climáticas o eventos de fuerza mayor
- Restricciones de envío a ciertas zonas geográficas

## 6. Devoluciones y Reembolsos

Aceptamos devoluciones de productos en las siguientes condiciones:

- El producto debe estar en su empaque original y sin usar
- La solicitud de devolución debe realizarse dentro de los 30 días posteriores a la entrega
- Los productos personalizados o en oferta especial no son elegibles para devolución
- Los costos de envío de devolución pueden ser responsabilidad del cliente

## 7. Propiedad Intelectual

Todo el contenido de la plataforma, incluyendo pero no limitado a logotipos, imágenes, textos, diseños y código, es propiedad de Ikono Verde o sus licenciantes y está protegido por leyes de propiedad intelectual. Queda prohibido:

- Copiar, reproducir o distribuir contenido sin autorización
- Modificar o crear trabajos derivados del contenido
- Utilizar marcas comerciales sin consentimiento expreso
- Realizar ingeniería inversa de cualquier parte de la plataforma

## 8. Limitación de Responsabilidad

Ikono Verde no será responsable por daños indirectos, incidentales, especiales, consecuentes o punitivos que resulten de:

- El uso o la imposibilidad de usar la plataforma
- Cualquier contenido obtenido de la plataforma
- Acceso no autorizado a sus datos o información personal
- Errores, virus o malware que puedan afectar su equipo

## 9. Modificaciones a los Términos

Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en la plataforma. Es responsabilidad del usuario revisar periódicamente estos términos. El uso continuado de la plataforma después de cualquier modificación constituye la aceptación de los nuevos términos.

## 10. Ley Aplicable y Jurisdicción

Estos Términos y Condiciones se regirán e interpretarán de acuerdo con las leyes de los Estados Unidos Mexicanos. Cualquier disputa que surja en relación con estos términos será sometida a los tribunales competentes de la Ciudad de México, México.

## 11. Contacto

Si tiene alguna pregunta o inquietud sobre estos Términos y Condiciones, puede contactarnos a través de:

- Correo electrónico: soporte@ikonoverde.com
- Teléfono: +52 (55) 1234-5678
- Dirección: Conkal Yucatan, México
MD;
    }

    private function privacyContent(): string
    {
        return <<<'MD'
## 1. Información que Recopilamos

En Ikono Verde Profesional, recopilamos la siguiente información para brindarle un mejor servicio:

- Información de registro: nombre, correo electrónico, teléfono y datos de la empresa
- Información de facturación: dirección fiscal, RFC y datos de pago
- Información de envío: direcciones de entrega
- Datos de uso: historial de navegación, búsquedas y preferencias dentro de la plataforma
- Información técnica: dirección IP, tipo de navegador y dispositivo utilizado

## 2. Uso de la Información

Utilizamos la información recopilada para los siguientes fines:

- Procesar y gestionar sus pedidos y entregas
- Administrar su cuenta y proporcionar atención al cliente
- Enviar comunicaciones sobre pedidos, promociones y actualizaciones del servicio
- Mejorar y personalizar su experiencia en la plataforma
- Cumplir con obligaciones legales y fiscales

## 3. Compartir Información

No vendemos ni alquilamos su información personal a terceros. Podemos compartir su información únicamente en los siguientes casos:

- Con proveedores de servicios de envío para realizar las entregas
- Con procesadores de pago para completar transacciones
- Cuando sea requerido por ley o por autoridades competentes
- Para proteger los derechos, seguridad o propiedad de Ikono Verde y sus usuarios

## 4. Seguridad de los Datos

Implementamos medidas de seguridad técnicas y organizativas para proteger su información personal, incluyendo:

- Cifrado de datos en tránsito mediante SSL/TLS
- Almacenamiento seguro de contraseñas con algoritmos de hash
- Acceso restringido a datos personales solo al personal autorizado
- Monitoreo continuo de actividad sospechosa en la plataforma

## 5. Cookies y Tecnologías Similares

Utilizamos cookies y tecnologías similares para mejorar su experiencia en la plataforma. Estas tecnologías nos permiten:

- Mantener su sesión activa mientras navega
- Recordar sus preferencias y configuraciones
- Analizar el uso de la plataforma para mejorar nuestros servicios
- Ofrecer contenido y recomendaciones relevantes

Puede configurar su navegador para rechazar cookies, aunque esto puede limitar algunas funcionalidades de la plataforma.

## 6. Derechos del Usuario

De acuerdo con la legislación aplicable, usted tiene derecho a:

- Acceder a sus datos personales que tenemos almacenados
- Solicitar la rectificación de datos incorrectos o incompletos
- Solicitar la eliminación de sus datos personales
- Oponerse al tratamiento de sus datos para fines específicos
- Solicitar la portabilidad de sus datos a otro proveedor

Para ejercer cualquiera de estos derechos, puede contactarnos a través de los medios indicados en la sección de Contacto.

## 7. Retención de Datos

Conservamos su información personal durante el tiempo necesario para cumplir con los fines para los que fue recopilada, incluyendo obligaciones legales, contables y de reportes. Los criterios para determinar el período de retención incluyen:

- La duración de la relación comercial con el usuario
- Obligaciones legales de conservación de registros fiscales y comerciales
- La necesidad de resolver disputas o hacer cumplir acuerdos

## 8. Menores de Edad

Ikono Verde Profesional es una plataforma B2B dirigida exclusivamente a profesionales y empresas. No recopilamos intencionalmente información de menores de 18 años. Si descubrimos que hemos recopilado datos de un menor, procederemos a eliminarlos de manera inmediata.

## 9. Cambios a esta Política

Nos reservamos el derecho de actualizar esta Política de Privacidad en cualquier momento. Los cambios serán publicados en esta página con la fecha de la última actualización. Le recomendamos revisar esta política periódicamente para estar informado sobre cómo protegemos su información.

## 10. Contacto

Si tiene preguntas o inquietudes sobre esta Política de Privacidad o sobre el tratamiento de sus datos personales, puede contactarnos a través de:

- Correo electrónico: soporte@ikonoverde.com
- Teléfono: +52 (55) 1234-5678
- Dirección: Conkal Yucatan, México
MD;
    }

    private function aboutContent(): string
    {
        return <<<'MD'
## Nuestra Historia

Ikono Verde nació con la misión de conectar a profesionales del sector con los mejores productos a precios mayoristas. Desde nuestros inicios en Yucatán, México, hemos crecido hasta convertirnos en un referente en el mercado B2B.

## Nuestra Misión

Facilitar el acceso a productos de alta calidad a precios competitivos, brindando una experiencia de compra profesional, eficiente y confiable para nuestros clientes empresariales.

## Nuestra Visión

Ser la plataforma B2B líder en México, reconocida por la calidad de nuestros productos, la excelencia en el servicio y la innovación en soluciones para profesionales.

## ¿Por qué Elegirnos?

- **Precios Mayoristas**: Acceso exclusivo a precios competitivos para profesionales
- **Catálogo Amplio**: Miles de productos de las mejores marcas
- **Envío Rápido**: Entregas eficientes en todo México
- **Soporte Dedicado**: Equipo especializado para atender tus necesidades

## Contacto

- Correo electrónico: soporte@ikonoverde.com
- Teléfono: +52 (55) 1234-5678
- Dirección: Conkal Yucatan, México
MD;
    }

    private function faqContent(): string
    {
        return <<<'MD'
## ¿Cómo puedo registrarme?

Para registrarte en Ikono Verde Profesional, haz clic en el botón "Registrarse" en la página principal. Completa el formulario con tus datos personales y de empresa. Una vez enviado, nuestro equipo revisará tu solicitud y activará tu cuenta.

## ¿Cuáles son los métodos de pago aceptados?

Aceptamos los siguientes métodos de pago:

- Tarjetas de crédito y débito (Visa, Mastercard, AMEX)
- Transferencia bancaria
- Depósito en efectivo

## ¿Cuánto tiempo tarda en llegar mi pedido?

Los tiempos de entrega varían según tu ubicación:

- **Zona Metropolitana**: 1-3 días hábiles
- **Interior de la República**: 3-7 días hábiles
- **Zonas remotas**: 7-14 días hábiles

## ¿Puedo hacer devoluciones?

Sí, aceptamos devoluciones dentro de los 30 días posteriores a la entrega. El producto debe estar en su empaque original y sin usar. Consulta nuestra sección de Términos y Condiciones para más detalles.

## ¿Hay un monto mínimo de compra?

No hay un monto mínimo de compra, pero los envíos gratuitos aplican a pedidos superiores a $500,000 MXN.

## ¿Cómo puedo contactar al soporte?

Puedes contactarnos a través de:

- Correo electrónico: soporte@ikonoverde.com
- Teléfono: +52 (55) 1234-5678
- Chat en vivo disponible en horario laboral
MD;
    }
}
