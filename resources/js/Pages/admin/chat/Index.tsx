import { Button } from '@/components/ui/button';
import { ChatContainerContent, ChatContainerRoot, ChatContainerScrollAnchor } from '@/components/ui/chat-container';
import { Loader } from '@/components/ui/loader';
import { PromptInput, PromptInputAction, PromptInputActions, PromptInputTextarea } from '@/components/ui/prompt-input';
import { PromptSuggestion } from '@/components/ui/prompt-suggestion';
import AppLayout from '@/Layouts/AppLayout';
import { ArrowUp, Bot, Brain, Database, FileText, Paperclip, Sparkles } from 'lucide-react';
import type { ComponentPropsWithoutRef } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const suggestions = [
    'Resume pedidos pendientes de hoy',
    'Redacta respuesta para un cliente',
    'Encuentra productos con bajo inventario',
    'Prepara ideas para el siguiente blog',
];

const sampleMessages = [
    {
        id: 'admin-brief',
        role: 'user',
        content: 'Necesito revisar qué temas debería atender primero esta mañana.',
    },
    {
        id: 'assistant-plan',
        role: 'assistant',
        content: 'Puedo ayudarte a priorizar **pedidos**, consultas de clientes, inventario y contenido.\n\nCuando conectemos la funcionalidad, esta vista podrá:\n\n- Consultar datos internos antes de proponer acciones.\n- Citar fuentes administrativas.\n- Pedir confirmación antes de modificar registros.',
    },
];

const dataSources = [
    { label: 'Pedidos', detail: 'Estados, notas y reembolsos', icon: Database },
    { label: 'Catálogo', detail: 'Productos, stock y precios', icon: FileText },
    { label: 'Contenido', detail: 'Blog, banners y páginas', icon: Sparkles },
];

export default function AdminChatIndex() {
    return (
        <AppLayout title="Chat" active="chat">
            <div className="flex h-screen min-h-[720px] flex-col bg-[#FBF9F7] font-[Outfit] text-[#1A1A1A]">
                <header className="border-b border-[#E5E5E5] bg-[#FBF9F7] px-8 py-6">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-3xl">
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#D9D6D0] bg-white px-3 py-1 text-xs font-medium text-[#4A5D4A]">
                                <Bot className="h-3.5 w-3.5" />
                                Asistente interno, UI preliminar
                            </div>
                            <h1 className="text-2xl font-semibold tracking-tight text-[#1A1A1A]">
                                Chat administrativo
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#666666]">
                                Una superficie para consultar operaciones, redactar respuestas y preparar acciones. Por ahora es una maqueta visual; la conexión con datos y modelos se implementará después.
                            </p>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-3 lg:w-[520px]">
                            {dataSources.map((source) => {
                                const Icon = source.icon;

                                return (
                                    <div key={source.label} className="rounded-2xl border border-[#E5E5E5] bg-white px-4 py-3">
                                        <div className="mb-2 flex items-center gap-2 text-xs font-medium text-[#4A5D4A]">
                                            <Icon className="h-3.5 w-3.5" />
                                            {source.label}
                                        </div>
                                        <p className="text-xs leading-5 text-[#666666]">{source.detail}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </header>

                <div className="grid min-h-0 flex-1 grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px]">
                    <section className="flex min-h-0 flex-col border-r border-[#E5E5E5] bg-[#FBF9F7]">
                        <ChatContainerRoot className="min-h-0 flex-1 px-6 py-8">
                            <ChatContainerContent className="mx-auto w-full max-w-3xl gap-6">
                                <div className="rounded-3xl border border-[#E5E5E5] bg-white p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#4A5D4A] text-white">
                                            <Brain className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-base font-semibold text-[#1A1A1A]">
                                                ¿Qué necesitas resolver?
                                            </h2>
                                            <p className="mt-1 text-sm leading-6 text-[#666666]">
                                                Prueba una solicitud operativa. Más adelante el chat podrá consultar datos reales, ejecutar tareas aprobadas y devolver fuentes.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-5 flex flex-wrap gap-2">
                                        {suggestions.map((suggestion) => (
                                            <PromptSuggestion key={suggestion} size="sm" className="rounded-full border-[#D9D6D0] bg-[#FBF9F7] text-[#4A5D4A] hover:bg-white">
                                                {suggestion}
                                            </PromptSuggestion>
                                        ))}
                                    </div>
                                </div>

                                {sampleMessages.map((message) => (
                                    <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        {message.role === 'assistant' && (
                                            <AssistantAvatar />
                                        )}
                                        <div className={message.role === 'user'
                                            ? 'max-w-[82%] rounded-2xl bg-[#4A5D4A] px-4 py-3 text-sm leading-6 text-white prose-p:m-0'
                                            : 'max-w-[82%] rounded-2xl border border-[#E5E5E5] bg-white px-4 py-3 text-sm leading-6 text-[#1A1A1A] prose-p:m-0'}>
                                            {message.role === 'assistant' ? (
                                                <ChatMarkdown>{message.content}</ChatMarkdown>
                                            ) : (
                                                message.content
                                            )}
                                        </div>
                                    </div>
                                ))}

                                <div className="flex justify-start gap-3">
                                    <AssistantAvatar />
                                    <div className="flex items-center gap-3 rounded-2xl border border-[#E5E5E5] bg-white px-4 py-3 text-sm text-[#666666]">
                                        <Loader variant="typing" size="sm" />
                                        Esperando funcionalidad
                                    </div>
                                </div>
                                <ChatContainerScrollAnchor />
                            </ChatContainerContent>
                        </ChatContainerRoot>

                        <div className="border-t border-[#E5E5E5] bg-[#FBF9F7] px-6 py-5">
                            <div className="mx-auto max-w-3xl">
                                <PromptInput disabled className="rounded-3xl border-[#D9D6D0] bg-white p-3 shadow-none">
                                    <PromptInputTextarea
                                        placeholder="La escritura se activará cuando conectemos el endpoint..."
                                        className="min-h-12 text-sm text-[#1A1A1A] placeholder:text-[#999999]"
                                    />
                                    <PromptInputActions className="justify-between border-t border-[#EDEAE5] pt-3">
                                        <PromptInputAction tooltip="Adjuntar archivos estará disponible después">
                                            <Button type="button" variant="ghost" size="icon" disabled className="rounded-full text-[#666666]">
                                                <Paperclip className="h-4 w-4" />
                                            </Button>
                                        </PromptInputAction>
                                        <Button type="button" disabled className="rounded-full bg-[#4A5D4A] px-4 text-white">
                                            Enviar
                                            <ArrowUp className="h-4 w-4" />
                                        </Button>
                                    </PromptInputActions>
                                </PromptInput>
                                <p className="mt-3 text-center text-xs text-[#999999]">
                                    Vista estática. Sin llamadas al modelo, historial persistente ni acciones administrativas todavía.
                                </p>
                            </div>
                        </div>
                    </section>

                    <aside className="hidden bg-[#F5F3F0] p-6 xl:block">
                        <div className="sticky top-6 flex flex-col gap-5">
                            <div>
                                <p className="text-xs font-medium tracking-[0.16em] text-[#999999]">CONTEXTO</p>
                                <h2 className="mt-2 text-lg font-semibold text-[#1A1A1A]">Diseñado para trabajo interno</h2>
                                <p className="mt-2 text-sm leading-6 text-[#666666]">
                                    El panel reserva espacio para fuentes, herramientas y permisos antes de ejecutar acciones reales.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-[#E5E5E5] bg-white p-4">
                                <h3 className="text-sm font-semibold text-[#1A1A1A]">Próximas capacidades</h3>
                                <div className="mt-4 flex flex-col gap-3 text-sm text-[#666666]">
                                    <Capability label="Consultar pedidos" />
                                    <Capability label="Redactar respuestas" />
                                    <Capability label="Sugerir acciones" />
                                    <Capability label="Citar fuentes internas" />
                                </div>
                            </div>

                            <div className="rounded-2xl border border-[#D9D6D0] bg-[#FBF9F7] p-4">
                                <p className="text-xs font-medium text-[#4A5D4A]">Regla operativa</p>
                                <p className="mt-2 text-sm leading-6 text-[#666666]">
                                    Las acciones que modifiquen pedidos, inventario o contenido deberán pedir confirmación explícita antes de ejecutarse.
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </AppLayout>
    );
}

function Capability({ label }: { label: string }) {
    return (
        <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-[#4A5D4A]" />
            <span>{label}</span>
        </div>
    );
}

function AssistantAvatar() {
    return (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#D9D6D0] bg-white text-xs font-semibold text-[#4A5D4A]">
            AI
        </div>
    );
}

function ChatMarkdown({ children }: { children: string }) {
    return (
        <Markdown remarkPlugins={[remarkGfm]} components={MARKDOWN_COMPONENTS}>
            {children}
        </Markdown>
    );
}

const MARKDOWN_COMPONENTS = {
    p: ({ children }: ComponentPropsWithoutRef<'p'>) => (
        <p className="mb-3 last:mb-0">{children}</p>
    ),
    ul: ({ children }: ComponentPropsWithoutRef<'ul'>) => (
        <ul className="mb-3 flex flex-col gap-1.5 pl-0 last:mb-0">{children}</ul>
    ),
    ol: ({ children }: ComponentPropsWithoutRef<'ol'>) => (
        <ol className="mb-3 flex list-decimal flex-col gap-1.5 pl-5 last:mb-0">{children}</ol>
    ),
    li: ({ children }: ComponentPropsWithoutRef<'li'>) => (
        <li className="relative list-none pl-5 before:absolute before:left-0 before:top-[0.72em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-[#4A5D4A]">
            {children}
        </li>
    ),
    a: ({ children, href, ...rest }: ComponentPropsWithoutRef<'a'>) => (
        <a
            {...rest}
            href={href}
            className="font-medium text-[#4A5D4A] underline decoration-[#D9D6D0] underline-offset-4 hover:decoration-[#4A5D4A]"
            target={href?.startsWith('http') ? '_blank' : undefined}
            rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
            {children}
        </a>
    ),
    code: ({ children }: ComponentPropsWithoutRef<'code'>) => (
        <code className="rounded-md bg-[#F5F3F0] px-1.5 py-0.5 font-mono text-[0.86em] text-[#4A5D4A]">
            {children}
        </code>
    ),
    pre: ({ children }: ComponentPropsWithoutRef<'pre'>) => (
        <pre className="mb-3 overflow-x-auto rounded-xl bg-[#F5F3F0] p-3 text-xs leading-5 text-[#1A1A1A] last:mb-0">
            {children}
        </pre>
    ),
    strong: ({ children }: ComponentPropsWithoutRef<'strong'>) => (
        <strong className="font-semibold text-[#1A1A1A]">{children}</strong>
    ),
    blockquote: ({ children }: ComponentPropsWithoutRef<'blockquote'>) => (
        <blockquote className="mb-3 rounded-xl border border-[#D9D6D0] bg-[#FBF9F7] px-3 py-2 text-[#666666] last:mb-0">
            {children}
        </blockquote>
    ),
};
