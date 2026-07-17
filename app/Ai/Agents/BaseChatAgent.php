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

abstract class BaseChatAgent implements Agent, Conversational
{
    use Promptable;

    /**
     * @param  list<array{role: 'user'|'assistant', content: string}>  $messages
     */
    public function __construct(protected array $messages = []) {}

    /**
     * Resolve the AI provider to use for this agent.
     */
    public function provider(): Lab|string
    {
        return Lab::Anthropic;
    }

    /**
     * Get the timeout in seconds for AI provider requests.
     */
    public function timeout(): int
    {
        return 120;
    }

    /**
     * Get the conversation history as AI messages.
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

    /**
     * Get the shared Ikonoverde context for the agent instructions.
     */
    protected function context(): Stringable|string
    {
        return IkonoverdeContext::prompt();
    }
}
