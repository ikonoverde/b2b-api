<?php

namespace App\Http\Controllers\Admin\Chat;

use App\Ai\AdminChatAgents;
use App\Http\Controllers\Controller;
use App\Models\AgentConversation;
use App\Models\AgentConversationMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShowChatController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        $selectedConversation = null;

        if ($request->filled('conversation')) {
            $selectedConversation = AgentConversation::query()
                ->where('user_id', $user->id)
                ->whereKey($request->string('conversation')->toString())
                ->firstOrFail();
        }

        $conversations = AgentConversation::query()
            ->where('user_id', $user->id)
            ->latest('updated_at')
            ->limit(40)
            ->get()
            ->map(fn (AgentConversation $conversation): array => $this->conversationPayload($conversation))
            ->all();

        $messages = $selectedConversation
            ? $selectedConversation->messages()
                ->oldest()
                ->get()
                ->map(fn (AgentConversationMessage $message): array => $this->messagePayload($message))
                ->all()
            : [];

        return Inertia::render('admin/chat/Index', [
            'agents' => AdminChatAgents::publicList(),
            'conversations' => $conversations,
            'selectedConversation' => $selectedConversation
                ? $this->conversationPayload($selectedConversation)
                : null,
            'messages' => $messages,
        ]);
    }

    /**
     * @return array{id: string, title: string, updated_at: string|null}
     */
    private function conversationPayload(AgentConversation $conversation): array
    {
        return [
            'id' => $conversation->id,
            'title' => $conversation->title,
            'updated_at' => $conversation->updated_at?->toISOString(),
        ];
    }

    /**
     * @return array{id: string, agent: string, role: string, content: string, created_at: string|null}
     */
    private function messagePayload(AgentConversationMessage $message): array
    {
        return [
            'id' => $message->id,
            'agent' => $message->agent,
            'role' => $message->role,
            'content' => $message->content,
            'created_at' => $message->created_at?->toISOString(),
        ];
    }
}
