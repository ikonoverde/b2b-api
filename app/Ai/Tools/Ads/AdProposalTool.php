<?php

namespace App\Ai\Tools\Ads;

use App\Ai\Tools\Ads\Concerns\FormatsToolResponses;
use App\Services\Ads\AdProposalSchema;
use App\Services\Ads\AdProposalService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;
use Illuminate\Support\Facades\Validator;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use Stringable;

abstract class AdProposalTool implements Tool
{
    use FormatsToolResponses;

    public function __construct(protected AdProposalService $proposals) {}

    abstract protected function platform(): string;

    abstract protected function platformLabel(): string;

    public function description(): Stringable|string
    {
        return $this->proposals->description($this->platformLabel());
    }

    public function handle(Request $request): Stringable|string
    {
        $validator = Validator::make($this->proposals->normalize($request->all()), $this->proposals->rules());

        if ($validator->fails()) {
            return $this->json([
                'error' => $validator->errors()->first(),
            ]);
        }

        /** @var array<string, mixed> $validated */
        $validated = $validator->validated();

        $proposal = $this->proposals->create($this->platform(), $validated);

        return $this->json($this->proposals->payload($proposal, $this->platformLabel()));
    }

    /**
     * @return array<string, Type>
     */
    public function schema(JsonSchema $schema): array
    {
        return AdProposalSchema::fields($schema);
    }
}
