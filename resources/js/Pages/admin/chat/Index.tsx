import { Button } from '@/components/ui/button';
import { ChatContainerContent, ChatContainerRoot, ChatContainerScrollAnchor } from '@/components/ui/chat-container';
import { Loader } from '@/components/ui/loader';
import { PromptInput, PromptInputAction, PromptInputActions, PromptInputTextarea } from '@/components/ui/prompt-input';
import { PromptSuggestion } from '@/components/ui/prompt-suggestion';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { ArrowLeft, ArrowUp, Bot, Brain, LineChart, MessageSquarePlus, MessagesSquare, Paperclip, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Agent = {
    name: string;
    description: string;
    status: string;
    welcome: string;
    suggestions: string[];
};

type Conversation = {
    id: string;
    title: string;
    updated_at: string | null;
};

type ChatMessage = {
    id: string;
    agent: string;
    role: 'user' | 'assistant';
    content: string;
    created_at?: string | null;
};

type Props = {
    agents: Record<string, Agent>;
    conversations: Conversation[];
    selectedConversation: Conversation | null;
    messages: ChatMessage[];
};

export default function AdminChatIndex({ agents, conversations, selectedConversation, messages: initialMessages }: Props) {
    const firstAgentKey = Object.keys(agents)[0] ?? 'ads';
    const [activeAgentKey, setActiveAgentKey] = useState(initialMessages[0]?.agent ?? firstAgentKey);
    const [activeConversation, setActiveConversation] = useState<Conversation | null>(selectedConversation);
    const [conversationList, setConversationList] = useState(conversations);
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
    const [input, setInput] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const activeAgent = agents[activeAgentKey] ?? agents[firstAgentKey];

    useEffect(() => {
        setActiveConversation(selectedConversation);
        setConversationList(conversations);
        setMessages(initialMessages);
        setActiveAgentKey(initialMessages[0]?.agent ?? firstAgentKey);
    }, [conversations, firstAgentKey, initialMessages, selectedConversation]);

    const startNewConversation = () => {
        setActiveConversation(null);
        setMessages([]);
        setInput('');
        setError(null);
        window.history.pushState({}, '', '/admin/chat');
    };

    const sendMessage = async () => {
        const content = input.trim();

        if (!content || isSending) {
            return;
        }

        const userMessage: ChatMessage = {
            id: crypto.randomUUID(),
            agent: activeAgentKey,
            role: 'user',
            content,
        };

        setMessages((current) => [...current, userMessage]);
        setInput('');
        setError(null);
        setIsSending(true);

        try {
            const response = await axios.post('/admin/chat/messages', {
                agent: activeAgentKey,
                conversation_id: activeConversation?.id,
                message: content,
            });

            const conversation = response.data.conversation as Conversation;
            const assistantMessage = response.data.message as ChatMessage;

            setActiveConversation(conversation);
            setConversationList((current) => [conversation, ...current.filter((item) => item.id !== conversation.id)]);
            setMessages((current) => [...current, assistantMessage]);

            if (!activeConversation) {
                window.history.replaceState({}, '', `/admin/chat?conversation=${conversation.id}`);
            }
        } catch {
            setError('No pude completar la respuesta. Revisa la configuracion del proveedor de AI e intenta de nuevo.');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <>
            <Head title="Chat" />
            <div className="grid min-h-screen bg-[#FBF9F7] font-[Outfit] text-[#1A1A1A] lg:grid-cols-[340px_minmax(0,1fr)]">
                <aside className="flex max-h-[48svh] min-h-0 flex-col border-b border-[#E5E5E5] bg-[#F5F3F0] lg:max-h-none lg:min-h-screen lg:border-b-0 lg:border-r">
                    <div className="border-b border-[#E5E5E5] px-5 py-5">
                        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-xs font-medium text-[#666666] hover:text-[#1A1A1A]">
                            <ArrowLeft className="h-3.5 w-3.5" />
                            Volver al admin
                        </Link>
                        <div className="mt-5 flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#4A5D4A] text-white">
                                <Bot className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-[#1A1A1A]">Ikonoverde AI</p>
                                <p className="mt-1 text-xs leading-5 text-[#666666]">Conversaciones internas persistentes para diagnostico y trabajo administrativo.</p>
                            </div>
                        </div>
                        <Button type="button" className="mt-5 w-full rounded-full bg-[#4A5D4A] text-white" onClick={startNewConversation}>
                            <MessageSquarePlus className="h-4 w-4" />
                            Nueva conversacion
                        </Button>
                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
                        <section>
                            <div className="mb-3 flex items-center justify-between px-1">
                                <p className="text-xs font-medium tracking-[0.14em] text-[#999999]">CONVERSACIONES</p>
                                <MessagesSquare className="h-4 w-4 text-[#999999]" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                {conversationList.length === 0 ? (
                                    <div className="rounded-2xl border border-[#E5E5E5] bg-[#FBF9F7] px-4 py-4 text-sm leading-6 text-[#666666]">
                                        Todavia no hay conversaciones. Escribe un mensaje para guardar la primera.
                                    </div>
                                ) : conversationList.map((conversation) => (
                                    <Link
                                        key={conversation.id}
                                        href={`/admin/chat?conversation=${conversation.id}`}
                                        className={`rounded-2xl px-4 py-3 transition-colors ${activeConversation?.id === conversation.id
                                            ? 'bg-white text-[#1A1A1A]'
                                            : 'text-[#666666] hover:bg-white/60'}`}
                                    >
                                        <span className="block truncate text-sm font-medium">{conversation.title}</span>
                                        <span className="mt-1 block text-xs text-[#999999]">{formatDate(conversation.updated_at)}</span>
                                    </Link>
                                ))}
                            </div>
                        </section>

                        <section className="mt-7">
                            <div className="mb-3 flex items-center justify-between px-1">
                                <p className="text-xs font-medium tracking-[0.14em] text-[#999999]">AGENTES</p>
                                <Sparkles className="h-4 w-4 text-[#999999]" />
                            </div>
                            <div className="flex flex-col gap-2">
                                {Object.entries(agents).map(([key, agent]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        className={`rounded-2xl border px-4 py-3 text-left transition-colors ${activeAgentKey === key
                                            ? 'border-[#D9D6D0] bg-white'
                                            : 'border-transparent bg-transparent hover:border-[#E5E5E5] hover:bg-white/60'}`}
                                        onClick={() => setActiveAgentKey(key)}
                                    >
                                        <span className="flex items-center justify-between gap-3">
                                            <span className="text-sm font-semibold text-[#1A1A1A]">{agent.name}</span>
                                            <span className="rounded-full bg-[#FBF9F7] px-2 py-1 text-[11px] text-[#4A5D4A]">{agent.status}</span>
                                        </span>
                                        <span className="mt-2 block text-xs leading-5 text-[#666666]">{agent.description}</span>
                                    </button>
                                ))}
                            </div>
                        </section>
                    </div>
                </aside>

                <main className="flex min-h-0 flex-col">
                    <header className="border-b border-[#E5E5E5] bg-[#FBF9F7] px-6 py-5 lg:px-8">
                        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                            <div className="max-w-3xl">
                                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#D9D6D0] bg-white px-3 py-1 text-xs font-medium text-[#4A5D4A]">
                                    <LineChart className="h-3.5 w-3.5" />
                                    {activeAgent.status}
                                </div>
                                <h1 className="text-2xl font-semibold tracking-tight text-[#1A1A1A]">{activeAgent.name}</h1>
                                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#666666]">{activeAgent.description}</p>
                            </div>
                            <div className="rounded-2xl border border-[#E5E5E5] bg-white px-4 py-3 text-sm leading-6 text-[#666666] xl:w-[360px]">
                                <span className="font-medium text-[#1A1A1A]">Conversacion:</span>{' '}
                                {activeConversation ? activeConversation.title : 'Nueva conversacion sin guardar'}
                            </div>
                        </div>
                    </header>

                    <section className="flex min-h-0 flex-1 flex-col bg-[#FBF9F7]">
                        <ChatContainerRoot className="min-h-0 flex-1 px-5 py-7 lg:px-8">
                            <ChatContainerContent className="mx-auto w-full max-w-3xl gap-6">
                                {messages.length === 0 && (
                                    <div className="rounded-3xl border border-[#E5E5E5] bg-white p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#4A5D4A] text-white">
                                                <Brain className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h2 className="text-base font-semibold text-[#1A1A1A]">{activeAgent.name} listo</h2>
                                                <p className="mt-1 text-sm leading-6 text-[#666666]">{activeAgent.welcome}</p>
                                            </div>
                                        </div>
                                        <div className="mt-5 flex flex-wrap gap-2">
                                            {activeAgent.suggestions.map((suggestion) => (
                                                <PromptSuggestion
                                                    key={suggestion}
                                                    size="sm"
                                                    className="rounded-full border-[#D9D6D0] bg-[#FBF9F7] text-[#4A5D4A] hover:bg-white"
                                                    onClick={() => setInput(suggestion)}
                                                >
                                                    {suggestion}
                                                </PromptSuggestion>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {messages.map((message) => (
                                    <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        {message.role === 'assistant' && <AssistantAvatar label={agents[message.agent]?.name ?? 'AI'} />}
                                        <div className={message.role === 'user'
                                            ? 'max-w-[82%] rounded-2xl bg-[#4A5D4A] px-4 py-3 text-sm leading-6 text-white prose-p:m-0'
                                            : 'max-w-[82%] rounded-2xl border border-[#E5E5E5] bg-white px-4 py-3 text-sm leading-6 text-[#1A1A1A] prose-p:m-0'}>
                                            {message.role === 'assistant' ? <ChatMarkdown>{message.content}</ChatMarkdown> : message.content}
                                        </div>
                                    </div>
                                ))}

                                {isSending && (
                                    <div className="flex justify-start gap-3">
                                        <AssistantAvatar label={activeAgent.name} />
                                        <div className="flex items-center gap-3 rounded-2xl border border-[#E5E5E5] bg-white px-4 py-3 text-sm text-[#666666]">
                                            <Loader variant="typing" size="sm" />
                                            Pensando
                                        </div>
                                    </div>
                                )}

                                {error && (
                                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                        {error}
                                    </div>
                                )}
                                <ChatContainerScrollAnchor />
                            </ChatContainerContent>
                        </ChatContainerRoot>

                        <div className="border-t border-[#E5E5E5] bg-[#FBF9F7] px-5 py-5 lg:px-8">
                            <div className="mx-auto max-w-3xl">
                                <PromptInput
                                    value={input}
                                    onValueChange={setInput}
                                    onSubmit={sendMessage}
                                    isLoading={isSending}
                                    className="rounded-3xl border-[#D9D6D0] bg-white p-3 shadow-none"
                                >
                                    <PromptInputTextarea
                                        placeholder={`Escribe para ${activeAgent.name}...`}
                                        className="min-h-12 text-sm text-[#1A1A1A] placeholder:text-[#999999]"
                                    />
                                    <PromptInputActions className="justify-between border-t border-[#EDEAE5] pt-3">
                                        <PromptInputAction tooltip="Adjuntar archivos estara disponible despues">
                                            <Button type="button" variant="ghost" size="icon" disabled className="rounded-full text-[#666666]">
                                                <Paperclip className="h-4 w-4" />
                                            </Button>
                                        </PromptInputAction>
                                        <Button
                                            type="button"
                                            disabled={isSending || input.trim() === ''}
                                            className="rounded-full bg-[#4A5D4A] px-4 text-white"
                                            onClick={sendMessage}
                                        >
                                            {isSending ? 'Enviando' : 'Enviar'}
                                            <ArrowUp className="h-4 w-4" />
                                        </Button>
                                    </PromptInputActions>
                                </PromptInput>
                                <p className="mt-3 text-center text-xs text-[#999999]">
                                    Las conversaciones se guardan para tu usuario. Verifica cualquier accion operativa antes de aplicarla.
                                </p>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}

function AssistantAvatar({ label }: { label: string }) {
    return (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#D9D6D0] bg-white text-[10px] font-semibold text-[#4A5D4A]">
            {label.slice(0, 2).toUpperCase()}
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

function formatDate(value: string | null) {
    if (!value) {
        return 'Sin fecha';
    }

    return new Intl.DateTimeFormat('es-MX', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(value));
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
