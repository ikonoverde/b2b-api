<?php

namespace App\Ai\Tools\Blog;

use App\Ai\Tools\Ads\Concerns\FormatsToolResponses;
use App\Services\Blog\BlogPostSchema;
use App\Services\Blog\BlogPostService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;
use Illuminate\Support\Facades\Validator;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use Stringable;

/**
 * Create a blog post as an unpublished draft, always.
 *
 * The MCP tool of the same name can publish, because Claude Code asks a human before every call.
 * Nothing asks here: the admin chat runs the whole agentic loop server-side and a tool call executes
 * the moment the model emits it. So the publication fields are not merely defaulted, they are
 * dropped before validation and re-imposed after. An instruction in a prompt is a request; this is
 * the guarantee. A human publishes from the blog admin.
 */
class CreateBlogPost implements Tool
{
    use FormatsToolResponses;

    public function __construct(private BlogPostService $posts) {}

    public function name(): string
    {
        return 'blog_create_draft_post';
    }

    public function description(): Stringable|string
    {
        return 'Create a blog post as an unpublished draft. It is saved to the storefront database but is not visible to anyone until a human publishes it from the admin. This tool cannot publish, and cannot schedule: do not tell the user their post is live.';
    }

    public function handle(Request $request): Stringable|string
    {
        $arguments = $this->posts->normalizeForCreate($request->all());

        unset($arguments['is_published'], $arguments['published_at']);

        $validator = Validator::make($arguments, $this->posts->createRules(), $this->posts->createMessages());

        if ($validator->fails()) {
            return $this->json(['error' => $validator->errors()->first()]);
        }

        /** @var array<string, mixed> $validated */
        $validated = $validator->validated();

        $validated['is_published'] = false;
        $validated['published_at'] = null;

        if (($validated['cover_image_path'] ?? null) !== null && ! $this->posts->coverImagePathIsValid($validated['cover_image_path'])) {
            return $this->json(['error' => $this->posts->coverImageError()]);
        }

        return $this->json([
            ...$this->posts->payload($this->posts->create($validated)),
            'status' => 'draft',
            'note' => 'Saved as an unpublished draft. Nobody can see it on the storefront until a human publishes it.',
        ]);
    }

    /**
     * @return array<string, Type>
     */
    public function schema(JsonSchema $schema): array
    {
        return BlogPostSchema::createFields($schema, withPublication: false);
    }
}
