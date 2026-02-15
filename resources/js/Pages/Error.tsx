import { Link } from '@inertiajs/react';
import { Leaf } from 'lucide-react';

interface ErrorProps {
    status: number;
}

export default function Error({ status }: ErrorProps) {
    const title = {
        503: '503: Servicio no disponible',
        500: '500: Error del servidor',
        404: '404: Pagina no encontrada',
        403: '403: Prohibido',
    }[status] ?? 'Error';

    const description = {
        503: 'Lo sentimos, estamos realizando mantenimiento. Por favor, intenta mas tarde.',
        500: 'Ups, algo salio mal en nuestros servidores.',
        404: 'Lo sentimos, la pagina que buscas no pudo ser encontrada.',
        403: 'Lo sentimos, no tienes permiso para acceder a esta pagina.',
    }[status] ?? 'Ha ocurrido un error.';

    return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-white">
            <div className="flex flex-col items-center gap-6 max-w-[500px] text-center">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#4A5D4A] rounded-xl flex items-center justify-center">
                        <Leaf className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-[32px] font-bold text-[#1A1A1A] font-[Outfit]">
                        Ikonoverde
                    </span>
                </div>

                <h1 className="text-[72px] font-bold text-[#4A5D4A] font-[Outfit]">
                    {status}
                </h1>

                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-semibold text-[#1A1A1A] font-[Outfit]">
                        {title}
                    </h2>
                    <p className="text-base text-[#666666] font-[Outfit]">
                        {description}
                    </p>
                </div>

                <Link
                    href="/admin"
                    className="mt-4 h-12 px-6 bg-[#4A5D4A] text-white font-semibold rounded-lg hover:bg-[#3d4d3d] focus:outline-none focus:ring-2 focus:ring-[#4A5D4A] focus:ring-offset-2 transition-colors font-[Outfit] flex items-center gap-2"
                >
                    Volver al inicio
                </Link>
            </div>
        </div>
    );
}
