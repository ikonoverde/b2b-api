<?php

namespace App\Http\Controllers\Admin\Chat;

use App\Ai\AdminChatAgents;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Chat\SendChatMessageRequest;
use App\Models\AgentConversation;
use App\Models\AgentConversationMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class SendChatMessageController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(SendChatMessageRequest $request): JsonResponse
    {
        $user = $request->user();
        $agent = $request->validated('agent');
        $content = $request->validated('message');
        $conversation = $this->resolveConversation($request, $content);
        $history = $conversation->messages()
            ->latest()
            ->limit(12)
            ->get()
            ->reverse()
            ->map(fn (AgentConversationMessage $message): array => [
                'role' => $message->role,
                'content' => $message->content,
            ])
            ->values()
            ->all();

        $this->createMessage($conversation, $user->id, $agent, 'user', $content);

        $agentClass = AdminChatAgents::classFor($agent);
        $response = $agentClass::make(messages: $history)->prompt($content);
        $assistantMessage = $this->createMessage($conversation, $user->id, $agent, 'assistant', (string) $response);

        $conversation->touch();

        return response()->json([
            'conversation' => $this->conversationPayload($conversation->refresh()),
            'message' => [
                'id' => $assistantMessage->id,
                'agent' => $assistantMessage->agent,
                'role' => 'assistant',
                'content' => (string) $response,
                'created_at' => $assistantMessage->created_at?->toISOString(),
            ],
        ]);
    }

    private function resolveConversation(SendChatMessageRequest $request, string $content): AgentConversation
    {
        $conversationId = $request->validated('conversation_id');
        $userId = $request->user()->id;

        if ($conversationId) {
            $conversation = AgentConversation::query()
                ->whereKey($conversationId)
                ->firstOrFail();

            abort_unless($conversation->user_id === $userId, 403);

            return $conversation;
        }

        return AgentConversation::query()->create([
            'user_id' => $userId,
            'title' => Str::of($content)->squish()->limit(64)->toString(),
        ]);
    }

    private function createMessage(
        AgentConversation $conversation,
        int $userId,
        string $agent,
        string $role,
        string $content,
    ): AgentConversationMessage {
        return $conversation->messages()->create([
            'user_id' => $userId,
            'agent' => $agent,
            'role' => $role,
            'content' => $content,
            'attachments' => [],
            'tool_calls' => [],
            'tool_results' => [],
            'usage' => [],
            'meta' => [],
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
}
