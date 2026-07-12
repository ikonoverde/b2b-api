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
 * Edit a post's words. Never its publication state.
 *
 * The publication fields are stripped for the same reason they are stripped on create: no human sees
 * this call before it runs. The model can rewrite a live post, which is recoverable, but it cannot
 * make a post live or take one down, which is a decision.
 */
class EditBlogPost implements Tool
{
    use FormatsToolResponses;

    public function __construct(private BlogPostService $posts) {}

    public function name(): string
    {
        return 'blog_edit_post';
    }

    public function description(): Stringable|string
    {
        return 'Edit an existing blog post by ID or slug. Partial update: fields you omit keep their stored value, and an empty string clears excerpt or cover_image_path. Call blog_get_post first to confirm you are editing the post you mean. This tool cannot publish or unpublish a post.';
    }

    public function handle(Request $request): Stringable|string
    {
        $arguments = $this->posts->normalizeForEdit($request->all());

        unset($arguments['is_published'], $arguments['published_at']);

        $validator = Validator::make($arguments, $this->posts->editRules(), $this->posts->editMessages());

        if ($validator->fails()) {
            return $this->json(['error' => $validator->errors()->first()]);
        }

        /** @var array<string, mixed> $validated */
        $validated = $validator->validated();

        $blogPost = $this->posts->resolve($validated, slugKey: 'current_slug');

        if ($blogPost === null) {
            return $this->json(['error' => 'Provide either id or current_slug to choose the blog post to edit.']);
        }

        $slugValidator = Validator::make($validated, $this->posts->slugRules($blogPost), $this->posts->slugMessages());

        if ($slugValidator->fails()) {
            return $this->json(['error' => $slugValidator->errors()->first()]);
        }

        if (array_key_exists('cover_image_path', $validated) && $validated['cover_image_path'] !== null && ! $this->posts->coverImagePathIsValid($validated['cover_image_path'])) {
            return $this->json(['error' => $this->posts->coverImageError()]);
        }

        $updates = $this->posts->updates($validated);

        if ($updates === []) {
            return $this->json(['error' => 'Provide at least one blog post field to update.']);
        }

        return $this->json(
            $this->posts->payload($this->posts->update($blogPost, $updates), withContent: true)
        );
    }

    /**
     * @return array<string, Type>
     */
    public function schema(JsonSchema $schema): array
    {
        return BlogPostSchema::editFields($schema, withPublication: false);
    }
}
