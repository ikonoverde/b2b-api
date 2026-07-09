<?php

namespace App\Ai\Tools\Keywords;

use App\Services\Keywords\KeywordResearchSchema;
use App\Services\Keywords\ProviderConfig;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use Stringable;

abstract class KeywordResearchTool implements Tool
{
    public function handle(Request $request): Stringable|string
    {
        $missingConfig = $this->missingConfig();

        if ($missingConfig !== []) {
            return $this->json($this->configErrorPayload($missingConfig, $request->all()));
        }

        return $this->json([
            'error' => true,
            'provider' => $this->providerKey(),
            'message' => $this->providerName().' credentials are configured, but the live API integration has not been implemented yet.',
            'received_arguments' => $request->all(),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function schema(JsonSchema $schema): array
    {
        return KeywordResearchSchema::commonFields($schema);
    }

    abstract protected function providerKey(): string;

    abstract protected function providerName(): string;

    /**
     * @return list<string>
     */
    abstract protected function requiredConfig(): array;

    /**
     * @return list<string>
     */
    protected function missingConfig(): array
    {
        return ProviderConfig::missing($this->requiredConfig());
    }

    /**
     * @param  list<string>  $missingConfig
     * @param  array<string, mixed>  $arguments
     * @return array<string, mixed>
     */
    protected function configErrorPayload(array $missingConfig, array $arguments): array
    {
        return [
            'error' => true,
            'provider' => $this->providerKey(),
            'message' => $this->providerName().' API is not configured.',
            'required_config' => $missingConfig,
            'received_arguments' => $arguments,
        ];
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    protected function json(array $payload): string
    {
        return json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
    }
}
