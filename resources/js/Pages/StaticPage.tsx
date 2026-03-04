import { Link } from '@inertiajs/react';
import { ArrowLeft, FileText } from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import PublicLayout from '@/Layouts/PublicLayout';
import type { PageProps } from '@/types';
import { formatDateMonthYear } from '@/utils/date';

interface StaticPageData {
    slug: string;
    title: string;
    content: string;
    updated_at: string | null;
}

interface Props extends PageProps {
    page: StaticPageData;
}

export default function StaticPage({ auth, page }: Props) {
    return (
        <PublicLayout title={page.title} auth={auth}>
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
                            <FileText className="w-7 h-7 text-[#8B6F47]" />
                        </div>
                        <div>
                            <h1 className="font-[Outfit] font-bold text-3xl text-[#1A1A1A]">
                                {page.title}
                            </h1>
                            {page.updated_at && (
                                <p className="font-[Outfit] text-sm text-[#666666]">
                                    Última actualización: {formatDateMonthYear(page.updated_at)}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="bg-white rounded-2xl border border-[#E5E5E5] p-8 shadow-sm">
                        <div className="prose prose-stone max-w-none font-[Outfit] prose-headings:font-[Outfit] prose-headings:font-semibold prose-headings:text-[#1A1A1A] prose-p:text-[#666666] prose-p:leading-relaxed prose-li:text-[#666666] prose-strong:text-[#1A1A1A]">
                            <Markdown remarkPlugins={[remarkGfm]}>{page.content}</Markdown>
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
                            href="/privacy"
                            className="text-[#5E7052] font-[Outfit] font-medium text-sm hover:underline"
                        >
                            Política de Privacidad
                        </Link>
                    </div>
                </div>
            </main>
        </PublicLayout>
    );
}
