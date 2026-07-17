<?php

namespace App\Ai\Tools\Growth;

use App\Ai\Tools\Ads\Concerns\FormatsToolResponses;
use App\Services\Growth\GrowthPlanService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use Stringable;

class GetGrowthPlan implements Tool
{
    use FormatsToolResponses;

    public function __construct(private GrowthPlanService $plans) {}

    public function name(): string
    {
        return 'growth_get_plan';
    }

    public function description(): Stringable|string
    {
        return 'Read the growth plan as it stands: every action with its tasks, and the standing paid-gate verdict. Read this before you propose anything. A plan that ignores the one already on file is not a plan, it is the same few ideas re-derived every time somebody asks — and you will re-propose work that is already open under a slightly different title.';
    }

    public function handle(Request $request): Stringable|string
    {
        return $this->json($this->plans->plan());
    }

    /**
     * @return array<string, Type>
     */
    public function schema(JsonSchema $schema): array
    {
        return [];
    }
}
