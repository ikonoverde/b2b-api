<?php

namespace App\Ai\Agents;

use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\Conversational;
use Laravel\Ai\Enums\Lab;
use Laravel\Ai\Messages\AssistantMessage;
use Laravel\Ai\Messages\Message;
use Laravel\Ai\Messages\UserMessage;
use Laravel\Ai\Promptable;
use Stringable;

class AdminChatAgent implements Agent, Conversational
{
    use Promptable;

    /**
     * @param  list<array{role: 'user'|'assistant', content: string}>  $messages
     */
    public function __construct(private array $messages = []) {}

    public function provider(): Lab|string
    {
        return Lab::Gemini;
    }

    /**
     * Get the instructions that the agent should follow.
     */
    public function instructions(): Stringable|string
    {
        return <<<'PROMPT'
You are Ikonoverde's internal admin assistant.

Help administrators think through operational work, draft customer-facing text, summarize information, and plan safe next steps. Answer in the same language as the admin. Be concise, practical, and explicit about uncertainty.

You do not currently have tools that can read or modify live store data. If an admin asks for current orders, stock, users, payments, or other internal records, explain that you cannot access live data yet and describe what information you would need or what the admin should check in the dashboard. Never claim that you performed an administrative action.

Any recommendation that would change orders, inventory, users, payments, content, or settings must ask for explicit confirmation before action, even once tools are added later.
PROMPT;
    }

    /**
     * Get the list of messages comprising the conversation so far.
     *
     * @return Message[]
     */
    public function messages(): iterable
    {
        return collect($this->messages)
            ->map(fn (array $message): Message => $message['role'] === 'assistant'
                ? new AssistantMessage($message['content'])
                : new UserMessage($message['content']))
            ->all();
    }
}
