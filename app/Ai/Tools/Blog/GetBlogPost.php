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

class GetBlogPost implements Tool
{
    use FormatsToolResponses;

    public function __construct(private BlogPostService $posts) {}

    public function name(): string
    {
        return 'blog_get_post';
    }

    public function description(): Stringable|string
    {
        return 'Read an existing blog post by ID or slug, including its markdown content, publication state, and cover image. Read this before editing a post, so the edit lands on the post you think it does.';
    }

    public function handle(Request $request): Stringable|string
    {
        $validator = Validator::make(
            $this->posts->normalizeForLookup($request->all()),
            $this->posts->lookupRules(),
            $this->posts->lookupMessages(),
        );

        if ($validator->fails()) {
            return $this->json(['error' => $validator->errors()->first()]);
        }

        /** @var array<string, mixed> $validated */
        $validated = $validator->validated();

        $blogPost = $this->posts->resolve($validated);

        if ($blogPost === null) {
            return $this->json(['error' => 'Provide either id or slug to choose the blog post to retrieve.']);
        }

        return $this->json($this->posts->payload($blogPost, withContent: true, withVisibility: true));
    }

    /**
     * @return array<string, Type>
     */
    public function schema(JsonSchema $schema): array
    {
        return BlogPostSchema::lookupFields($schema);
    }
}
