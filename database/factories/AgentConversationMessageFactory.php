<?php

namespace Database\Factories;

use App\Models\AgentConversation;
use App\Models\AgentConversationMessage;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AgentConversationMessage>
 */
class AgentConversationMessageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'conversation_id' => AgentConversation::factory(),
            'user_id' => User::factory(),
            'agent' => 'admin',
            'role' => 'user',
            'content' => fake()->sentence(),
            'attachments' => [],
            'tool_calls' => [],
            'tool_results' => [],
            'usage' => [],
            'meta' => [],
        ];
    }

    public function assistant(): static
    {
        return $this->state(fn (): array => [
            'role' => 'assistant',
        ]);
    }
}
