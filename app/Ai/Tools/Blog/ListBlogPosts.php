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
 * What the blog actually contains, so the model stops guessing.
 *
 * A model with no way to list posts either invents the library it thinks exists or writes a duplicate
 * of a post already there. The listing reports the true state of each post: a draft the model wrote
 * last week is still a draft, and saying so is the point.
 */
class ListBlogPosts implements Tool
{
    use FormatsToolResponses;

    public function __construct(private BlogPostService $posts) {}

    public function name(): string
    {
        return 'blog_list_posts';
    }

    public function description(): Stringable|string
    {
        return 'List blog posts, newest first, without their markdown bodies. Filter by status (live, scheduled, draft, or all) and by a search term matched against title, slug, and excerpt. Use this before planning or writing to see what already exists, and to find the slug of a post you want to read or edit.';
    }

    public function handle(Request $request): Stringable|string
    {
        $validator = Validator::make(
            $this->posts->normalizeForList($request->all()),
            $this->posts->listRules(),
            $this->posts->listMessages(),
        );

        if ($validator->fails()) {
            return $this->json(['error' => $validator->errors()->first()]);
        }

        /** @var array<string, mixed> $validated */
        $validated = $validator->validated();

        return $this->json($this->posts->list($validated));
    }

    /**
     * @return array<string, Type>
     */
    public function schema(JsonSchema $schema): array
    {
        return BlogPostSchema::listFields($schema);
    }
}
