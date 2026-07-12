<?php

namespace App\Ai\Tools\Social;

use App\Ai\Tools\Ads\Concerns\FormatsToolResponses;
use App\Models\SocialPostDraft;
use App\Services\Social\SocialPostDraftService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;
use Illuminate\Support\Facades\Validator;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use Stringable;

/**
 * The only social tool the agent holds that writes anything, and it writes to a table Meta never reads.
 *
 * The Claude Code social-media agent can publish, because the harness stops and asks a human before
 * each irreversible call. The admin chat has no such step: the agentic loop runs server-side and a
 * tool executes the instant the model emits it. Handing that loop `post_to_facebook` would mean the
 * brand's public account is one hallucinated tool call away from a post that cannot be taken back.
 * So the agent proposes, and a human in the admin decides. The gate is in the architecture, not in
 * the prompt, because a prompt is a request and this needs to be a guarantee.
 */
class CreateSocialPostDraft implements Tool
{
    use FormatsToolResponses;

    public function __construct(private SocialPostDraftService $drafts) {}

    public function name(): string
    {
        return 'social_create_post_draft';
    }

    public function description(): Stringable|string
    {
        return $this->drafts->description();
    }

    public function handle(Request $request): Stringable|string
    {
        $validator = Validator::make(
            $this->drafts->normalize($request->all()),
            $this->drafts->rules(),
            $this->drafts->messages(),
        );

        if ($validator->fails()) {
            return $this->json(['error' => $validator->errors()->first()]);
        }

        /** @var array<string, mixed> $validated */
        $validated = $validator->validated();

        if (($validated['image_path'] ?? null) !== null && ! $this->drafts->imagePathIsValid($validated['image_path'])) {
            return $this->json(['error' => $this->drafts->imageError()]);
        }

        return $this->json($this->drafts->payload($this->drafts->create($validated)));
    }

    /**
     * @return array<string, Type>
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'platform' => $schema->string()
                ->enum(SocialPostDraft::PLATFORMS)
                ->description('Which account the post is for. Instagram requires an image.')
                ->required(),
            'caption' => $schema->string()
                ->description('The post copy, in Mexican Spanish, exactly as it should appear if a human approves it. Never state a price: prices change and the post does not.')
                ->required(),
            'image_path' => $schema->string()
                ->nullable()
                ->description('Path to an image already on the public storage disk, from generate_image. Required for Instagram. Generating an image posts nothing.'),
            'link' => $schema->string()
                ->nullable()
                ->description('Optional full URL to attach. Facebook only; Instagram captions cannot carry a working link.'),
            'rationale' => $schema->string()
                ->nullable()
                ->description('Why this post, for the human reviewing it: the audience, the angle, and what it is meant to do. Label anything you did not get from a tool as ESTIMATED.'),
            'brand_review' => $schema->string()
                ->nullable()
                ->description('The brand reviewer verdict on this caption, if you asked for one. Quote it rather than summarizing it.'),
            'proposed_for' => $schema->string()
                ->nullable()
                ->description('Optional suggested date and time to post. A suggestion for the human, not a schedule: nothing will fire on its own.'),
        ];
    }
}
