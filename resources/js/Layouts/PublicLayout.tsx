import { Head, Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import type { PageProps } from '@/types';

interface PublicLayoutProps extends PropsWithChildren {
    title: string;
    auth: PageProps['auth'];
}

export default function PublicLayout({ title, auth, children }: PublicLayoutProps) {
    return (
        <>
            <Head title={title} />
            <div className="min-h-screen bg-[#FAF6F1] flex flex-col">
                {/* Header */}
                <header className="bg-[#5E7052] px-8 py-4">
                    <div className="max-w-6xl mx-auto flex items-center justify-between">
                        <Link href="/" className="flex flex-col">
                            <span className="text-white font-[Outfit] font-bold text-xl tracking-wider">
                                Ikonoverde
                            </span>
                            <span className="text-[#A8B5A0] font-[Outfit] text-xs tracking-widest uppercase">
                                PROFESIONAL
                            </span>
                        </Link>

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

                {children}

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
