import { Button } from '@/components/ui/button';
import { ChatContainerContent, ChatContainerRoot } from '@/components/ui/chat-container';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Loader } from '@/components/ui/loader';
import { Message, MessageAction, MessageActions, MessageContent } from '@/components/ui/message';
import { PromptInput, PromptInputAction, PromptInputActions, PromptInputTextarea } from '@/components/ui/prompt-input';
import { PromptSuggestion } from '@/components/ui/prompt-suggestion';
import { ScrollButton } from '@/components/ui/scroll-button';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { ArrowLeft, ArrowUp, Bot, ChevronDown, Copy, MessageSquarePlus, Mic, Paperclip, Plus, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

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

    const copyMessage = (content: string) => {
        navigator.clipboard?.writeText(content).catch(() => undefined);
    };

    const conversationGroups = groupConversations(conversationList);
    const headerTitle = activeConversation?.title ?? `${activeAgent.name} · Nueva conversacion`;

    return (
        <>
            <Head title="Chat" />
            <SidebarProvider>
                <Sidebar>
                    <SidebarHeader className="gap-4 px-2 py-4">
                        <div className="flex flex-row items-center gap-2 px-2">
                            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
                                <Bot className="size-4" />
                            </div>
                            <div className="text-md text-foreground font-medium tracking-tight">Ikonoverde AI</div>
                        </div>
                        <Link
                            href="/admin/dashboard"
                            className="text-muted-foreground hover:text-foreground flex items-center gap-2 px-2 text-xs font-medium"
                        >
                            <ArrowLeft className="size-3.5" />
                            Volver al admin
                        </Link>
                    </SidebarHeader>
                    <SidebarContent className="pt-2">
                        <div className="px-4">
                            <Button variant="outline" className="mb-2 flex w-full items-center gap-2" onClick={startNewConversation}>
                                <MessageSquarePlus className="size-4" />
                                <span>Nueva conversacion</span>
                            </Button>
                        </div>

                        {conversationGroups.length === 0 ? (
                            <SidebarGroup>
                                <SidebarGroupLabel>Conversaciones</SidebarGroupLabel>
                                <p className="text-muted-foreground px-2 text-xs leading-5">
                                    Todavia no hay conversaciones. Escribe un mensaje para guardar la primera.
                                </p>
                            </SidebarGroup>
                        ) : (
                            conversationGroups.map((group) => (
                                <SidebarGroup key={group.period}>
                                    <SidebarGroupLabel>{group.period}</SidebarGroupLabel>
                                    <SidebarMenu>
                                        {group.conversations.map((conversation) => (
                                            <SidebarMenuButton
                                                key={conversation.id}
                                                isActive={activeConversation?.id === conversation.id}
                                                onClick={() => router.get(`/admin/chat?conversation=${conversation.id}`)}
                                            >
                                                <span className="truncate">{conversation.title}</span>
                                            </SidebarMenuButton>
                                        ))}
                                    </SidebarMenu>
                                </SidebarGroup>
                            ))
                        )}
                    </SidebarContent>
                </Sidebar>

                <SidebarInset>
                    <main className="flex h-svh flex-col overflow-hidden">
                        <header className="bg-background z-10 flex h-16 w-full shrink-0 items-center gap-2 border-b px-4">
                            <SidebarTrigger className="-ml-1" />
                            <div className="text-foreground truncate">{headerTitle}</div>
                        </header>

                        <div className="relative flex-1 overflow-y-auto">
                            <ChatContainerRoot className="h-full">
                                <ChatContainerContent className="space-y-0 px-5 py-12">
                                    {messages.length === 0 && (
                                        <div className="mx-auto w-full max-w-3xl px-6">
                                            <div className="bg-card rounded-3xl border p-6">
                                                <div className="flex items-start gap-4">
                                                    <div className="bg-primary text-primary-foreground flex size-11 shrink-0 items-center justify-center rounded-2xl">
                                                        <Sparkles className="size-5" />
                                                    </div>
                                                    <div>
                                                        <h2 className="text-foreground text-base font-semibold">{activeAgent.name} listo</h2>
                                                        <p className="text-muted-foreground mt-1 text-sm leading-6">{activeAgent.welcome}</p>
                                                    </div>
                                                </div>
                                                <div className="mt-5 flex flex-wrap gap-2">
                                                    {activeAgent.suggestions.map((suggestion) => (
                                                        <PromptSuggestion key={suggestion} size="sm" onClick={() => setInput(suggestion)}>
                                                            {suggestion}
                                                        </PromptSuggestion>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {messages.map((message, index) => {
                                        const isAssistant = message.role === 'assistant';
                                        const isLastMessage = index === messages.length - 1;

                                        return (
                                            <Message
                                                key={message.id}
                                                className={cn(
                                                    'mx-auto flex w-full max-w-3xl flex-col gap-2 px-6',
                                                    isAssistant ? 'items-start' : 'items-end',
                                                )}
                                            >
                                                {isAssistant ? (
                                                    <div className="group flex w-full flex-col gap-0">
                                                        <MessageContent
                                                            className="text-foreground prose dark:prose-invert flex-1 rounded-lg bg-transparent p-0"
                                                            markdown
                                                        >
                                                            {message.content}
                                                        </MessageContent>
                                                        <MessageActions
                                                            className={cn(
                                                                '-ml-2.5 flex gap-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100',
                                                                isLastMessage && 'opacity-100',
                                                            )}
                                                        >
                                                            <MessageAction tooltip="Copiar">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="rounded-full"
                                                                    onClick={() => copyMessage(message.content)}
                                                                >
                                                                    <Copy />
                                                                </Button>
                                                            </MessageAction>
                                                        </MessageActions>
                                                    </div>
                                                ) : (
                                                    <div className="group flex flex-col items-end gap-1">
                                                        <MessageContent className="bg-muted text-foreground max-w-[85%] rounded-3xl px-5 py-2.5 sm:max-w-[75%]">
                                                            {message.content}
                                                        </MessageContent>
                                                        <MessageActions className="flex gap-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                                                            <MessageAction tooltip="Copiar">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="rounded-full"
                                                                    onClick={() => copyMessage(message.content)}
                                                                >
                                                                    <Copy />
                                                                </Button>
                                                            </MessageAction>
                                                        </MessageActions>
                                                    </div>
                                                )}
                                            </Message>
                                        );
                                    })}

                                    {isSending && (
                                        <div className="mx-auto flex w-full max-w-3xl items-center gap-3 px-6 py-2">
                                            <Loader variant="typing" size="sm" />
                                            <span className="text-muted-foreground text-sm">Pensando</span>
                                        </div>
                                    )}

                                    {error && (
                                        <div className="mx-auto w-full max-w-3xl px-6">
                                            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
                                                {error}
                                            </div>
                                        </div>
                                    )}
                                </ChatContainerContent>
                                <div className="absolute bottom-4 left-1/2 flex w-full max-w-3xl -translate-x-1/2 justify-end px-5">
                                    <ScrollButton className="shadow-sm" />
                                </div>
                            </ChatContainerRoot>
                        </div>

                        <div className="bg-background z-10 shrink-0 px-3 pb-3 md:px-5 md:pb-5">
                            <div className="mx-auto max-w-3xl">
                                <PromptInput
                                    isLoading={isSending}
                                    value={input}
                                    onValueChange={setInput}
                                    onSubmit={sendMessage}
                                    className="border-input bg-popover relative z-10 w-full rounded-3xl border p-0 pt-1 shadow-xs"
                                >
                                    <div className="flex flex-col">
                                        <PromptInputTextarea
                                            placeholder={`Escribe para ${activeAgent.name}...`}
                                            className="min-h-[44px] pt-3 pl-4 text-base leading-[1.3] sm:text-base md:text-base"
                                        />

                                        <PromptInputActions className="mt-5 flex w-full items-center justify-between gap-2 px-3 pb-3">
                                            <div className="flex items-center gap-2">
                                                <PromptInputAction tooltip="Nueva conversacion">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="size-9 rounded-full"
                                                        onClick={startNewConversation}
                                                    >
                                                        <Plus size={18} />
                                                    </Button>
                                                </PromptInputAction>

                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            className="h-9 gap-1.5 rounded-full px-3 text-sm font-medium"
                                                        >
                                                            <Sparkles className="size-4" />
                                                            <span className="max-w-[10rem] truncate">{activeAgent.name}</span>
                                                            <ChevronDown className="text-muted-foreground size-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="start" side="top" className="w-72">
                                                        {Object.entries(agents).map(([key, agent]) => (
                                                            <DropdownMenuItem
                                                                key={key}
                                                                onSelect={() => setActiveAgentKey(key)}
                                                                className="flex-col items-start gap-0.5 py-2"
                                                            >
                                                                <div className="flex w-full items-center gap-2">
                                                                    <span className="font-medium">{agent.name}</span>
                                                                    <span className="text-muted-foreground ml-auto text-[10px] tracking-wide uppercase">
                                                                        {agent.status}
                                                                    </span>
                                                                </div>
                                                                <span className="text-muted-foreground text-xs leading-5">
                                                                    {agent.description}
                                                                </span>
                                                            </DropdownMenuItem>
                                                        ))}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>

                                                <PromptInputAction tooltip="Adjuntar archivos estara disponible despues">
                                                    <Button variant="outline" size="icon" disabled className="size-9 rounded-full">
                                                        <Paperclip size={18} />
                                                    </Button>
                                                </PromptInputAction>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <PromptInputAction tooltip="Dictado estara disponible despues">
                                                    <Button variant="outline" size="icon" disabled className="size-9 rounded-full">
                                                        <Mic size={18} />
                                                    </Button>
                                                </PromptInputAction>

                                                <Button
                                                    size="icon"
                                                    disabled={!input.trim() || isSending}
                                                    onClick={sendMessage}
                                                    className="size-9 rounded-full"
                                                >
                                                    {!isSending ? <ArrowUp size={18} /> : <span className="size-3 rounded-xs bg-white" />}
                                                </Button>
                                            </div>
                                        </PromptInputActions>
                                    </div>
                                </PromptInput>
                                <p className="text-muted-foreground mt-3 text-center text-xs">
                                    Las conversaciones se guardan para tu usuario. Verifica cualquier accion operativa antes de aplicarla.
                                </p>
                            </div>
                        </div>
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </>
    );
}

type ConversationGroup = {
    period: string;
    conversations: Conversation[];
};

function groupConversations(conversations: Conversation[]): ConversationGroup[] {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const day = 86_400_000;
    const startOfYesterday = startOfToday - day;
    const sevenDaysAgo = startOfToday - 7 * day;
    const thirtyDaysAgo = startOfToday - 30 * day;

    const groups: ConversationGroup[] = [
        { period: 'Hoy', conversations: [] },
        { period: 'Ayer', conversations: [] },
        { period: 'Ultimos 7 dias', conversations: [] },
        { period: 'Ultimos 30 dias', conversations: [] },
        { period: 'Anteriores', conversations: [] },
    ];

    for (const conversation of conversations) {
        const timestamp = conversation.updated_at ? new Date(conversation.updated_at).getTime() : 0;

        if (timestamp >= startOfToday) {
            groups[0].conversations.push(conversation);
        } else if (timestamp >= startOfYesterday) {
            groups[1].conversations.push(conversation);
        } else if (timestamp >= sevenDaysAgo) {
            groups[2].conversations.push(conversation);
        } else if (timestamp >= thirtyDaysAgo) {
            groups[3].conversations.push(conversation);
        } else {
            groups[4].conversations.push(conversation);
        }
    }

    return groups.filter((group) => group.conversations.length > 0);
}
