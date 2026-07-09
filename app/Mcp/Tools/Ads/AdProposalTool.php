<?php

namespace App\Mcp\Tools\Ads;

use App\Services\Ads\AdProposalSchema;
use App\Services\Ads\AdProposalService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\ResponseFactory;
use Laravel\Mcp\Server\Tool;

abstract class AdProposalTool extends Tool
{
    public function __construct(protected AdProposalService $proposals) {}

    abstract protected function platform(): string;

    abstract protected function platformLabel(): string;

    public function handle(Request $request): Response|ResponseFactory
    {
        $user = $request->user();

        if ($user === null || ! in_array($user->role, ['admin', 'super_admin'], true)) {
            return Response::error('Permission denied.');
        }

        $request->setArguments($this->proposals->normalize($request->all()));

        $validated = $request->validate($this->proposals->rules());

        $proposal = $this->proposals->create($this->platform(), $validated);

        return Response::structured($this->proposals->payload($proposal, $this->platformLabel()));
    }

    /**
     * @return array<string, Type>
     */
    public function schema(JsonSchema $schema): array
    {
        return AdProposalSchema::fields($schema);
    }

    /**
     * @return array<string, Type>
     */
    public function outputSchema(JsonSchema $schema): array
    {
        return [
            'proposal_id' => $schema->integer()->description('ID of the stored draft proposal.')->required(),
            'platform' => $schema->string()->description('Ad platform the proposal targets.')->required(),
            'status' => $schema->string()->description('Always draft. Proposals are never published from here.')->required(),
            'name' => $schema->string()->description('Internal proposal name.')->required(),
            'objective' => $schema->string()->description('Campaign goal recorded on the proposal.')->required(),
            'summary' => $schema->string()->description('Human readable confirmation that nothing was changed in an external ad platform.')->required(),
        ];
    }
}
