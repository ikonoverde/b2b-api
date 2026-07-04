<?php

namespace App\Ai\Tools\Keywords;

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
            return $this->json([
                'error' => true,
                'provider' => $this->providerKey(),
                'message' => $this->providerName().' API is not configured.',
                'required_config' => $missingConfig,
                'received_arguments' => $request->all(),
            ]);
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
        return [
            'query' => $schema->string()
                ->nullable()
                ->description('Seed keyword, topic, product, category, or search query to investigate.'),
            'keywords' => $schema->array()
                ->nullable()
                ->description('Optional list of seed keywords when researching a cluster.'),
            'domain' => $schema->string()
                ->nullable()
                ->description('Optional target domain for keyword gap, ranking, or Search Console style analysis.'),
            'competitors' => $schema->array()
                ->nullable()
                ->description('Optional competitor domains to compare against.'),
            'country' => $schema->string()
                ->nullable()
                ->description('Country or market code. Prefer MX for Ikonoverde unless the user asks otherwise.'),
            'language' => $schema->string()
                ->nullable()
                ->description('Language code. Prefer es for Mexican Spanish keyword research unless the user asks otherwise.'),
            'date_range' => $schema->string()
                ->nullable()
                ->description('Optional reporting date range such as last_28_days, last_3_months, or 2026-01-01:2026-01-31.'),
            'limit' => $schema->integer()
                ->nullable()
                ->description('Maximum records to return when the provider integration is implemented.'),
        ];
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
    private function missingConfig(): array
    {
        return collect($this->requiredConfig())
            ->filter(fn (string $key): bool => blank(config($key)))
            ->values()
            ->all();
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    protected function json(array $payload): string
    {
        return json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
    }
}
