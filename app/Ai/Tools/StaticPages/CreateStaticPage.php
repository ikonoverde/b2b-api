<?php

namespace App\Ai\Tools\StaticPages;

use App\Ai\Tools\Ads\Concerns\FormatsToolResponses;
use App\Services\StaticPages\StaticPageSchema;
use App\Services\StaticPages\StaticPageService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;
use Illuminate\Support\Facades\Validator;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use Stringable;

/**
 * Create a static page as an unpublished draft, always.
 *
 * The existing static pages are edited, never spawned, so this is the one tool that mints a new slug.
 * That makes it the more dangerous of the two, not the safer: an edit rewrites a page a human already
 * approved, while a create introduces a page nobody has read. So it follows the blog draft rule rather
 * than the edit rule. `is_published` is dropped before validation and a draft is forced after, the same
 * unattended-loop guarantee CreateBlogPost gives: nothing this tool saves is visible until a human
 * publishes it from the admin.
 *
 * A new slug is also unreachable on the web storefront, whose routes name their four pages one by one.
 * The page still resolves on the mobile API once a human publishes it, which is exactly why the draft is
 * forced here and not merely suggested.
 */
class CreateStaticPage implements Tool
{
    use FormatsToolResponses;

    public function __construct(private StaticPageService $pages) {}

    public function name(): string
    {
        return 'static_page_create';
    }

    public function description(): Stringable|string
    {
        return 'Create a new static storefront page as an unpublished draft. It is saved to the database but is not visible to anyone until a human publishes it from the admin. This tool cannot publish. A new slug is not served on the web storefront, whose routes name each page individually; a human must add a route for it to appear on the web. Prefer editing an existing page over creating a near-duplicate: call static_pages_list first.';
    }

    public function handle(Request $request): Stringable|string
    {
        $arguments = $this->pages->normalizeForCreate($request->all());

        unset($arguments['is_published']);

        $validator = Validator::make($arguments, $this->pages->createRules(), $this->pages->createMessages());

        if ($validator->fails()) {
            return $this->json(['error' => $validator->errors()->first()]);
        }

        /** @var array<string, mixed> $validated */
        $validated = $validator->validated();

        return $this->json([
            ...$this->pages->payload($this->pages->create($validated), withContent: true),
            'status' => 'draft',
            'note' => 'Saved as an unpublished draft. A human must publish it from the admin before anyone can see it, and a human must add a storefront route before it appears on the web.',
        ]);
    }

    /**
     * @return array<string, Type>
     */
    public function schema(JsonSchema $schema): array
    {
        return StaticPageSchema::createFields($schema);
    }
}
