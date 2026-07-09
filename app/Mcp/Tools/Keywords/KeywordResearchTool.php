<?php

namespace App\Mcp\Tools\Keywords;

use App\Services\Keywords\KeywordResearchSchema;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\ResponseFactory;
use Laravel\Mcp\Server\Tool;

abstract class KeywordResearchTool extends Tool
{
    /**
     * Run the provider request once permissions and configuration have been checked.
     *
     * @param  array<string, mixed>  $arguments
     * @return array<string, mixed>
     */
    abstract protected function fetch(array $arguments): array;

    abstract protected function providerName(): string;

    /**
     * Config keys the provider needs but does not have.
     *
     * @return list<string>
     */
    abstract protected function missingConfig(): array;

    /**
     * @return array<string, array<int, string>>
     */
    abstract protected function rules(): array;

    public function handle(Request $request): Response|ResponseFactory
    {
        $user = $request->user();

        if ($user === null || ! in_array($user->role, ['admin', 'super_admin'], true)) {
            return Response::error('Permission denied.');
        }

        $missingConfig = $this->missingConfig();

        if ($missingConfig !== []) {
            return Response::error(sprintf(
                '%s API is not configured. Missing config: %s.',
                $this->providerName(),
                implode(', ', $missingConfig),
            ));
        }

        $result = $this->fetch($request->validate($this->rules()));

        if (($result['error'] ?? false) === true) {
            return Response::error(sprintf(
                '%s request failed: %s',
                $this->providerName(),
                $this->errorMessage($result),
            ));
        }

        return Response::structured($result);
    }

    /**
     * Validation rules shared by every keyword research tool.
     *
     * @return array<string, array<int, string>>
     */
    protected function commonRules(): array
    {
        return [
            'query' => ['nullable', 'string'],
            'keywords' => ['nullable', 'array'],
            'keywords.*' => ['string'],
            'domain' => ['nullable', 'string'],
            'competitors' => ['nullable', 'array'],
            'competitors.*' => ['string'],
            'country' => ['nullable', 'string'],
            'language' => ['nullable', 'string'],
            'date_range' => ['nullable', 'string'],
        ];
    }

    /**
     * @return array<string, Type>
     */
    public function schema(JsonSchema $schema): array
    {
        return KeywordResearchSchema::commonFields($schema);
    }

    /**
     * The provider services report failures as a payload rather than an exception.
     *
     * @param  array<string, mixed>  $result
     */
    private function errorMessage(array $result): string
    {
        if (is_string($result['message'] ?? null)) {
            return $result['message'];
        }

        if (isset($result['status'])) {
            return sprintf('the provider returned HTTP %s.', $result['status']);
        }

        return 'the provider returned an unspecified error.';
    }
}
