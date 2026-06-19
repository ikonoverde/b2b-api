<?php

namespace App\Http\Controllers\Admin\BlogPosts;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndexBlogPostsController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $search = $request->query('search', '');

        $posts = BlogPost::query()
            ->when($search, function ($query, string $search): void {
                $query->where(function ($q) use ($search): void {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('slug', 'like', "%{$search}%");
                });
            })
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (BlogPost $post) => [
                'id' => $post->id,
                'title' => $post->title,
                'slug' => $post->slug,
                'is_published' => $post->is_published,
                'published_at' => $post->published_at?->toISOString(),
                'updated_at' => $post->updated_at?->toISOString(),
                'status' => $this->statusFor($post),
            ]);

        return Inertia::render('admin/blog-posts/Index', [
            'posts' => $posts,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    private function statusFor(BlogPost $post): string
    {
        if (! $post->is_published || $post->published_at === null) {
            return 'draft';
        }

        return $post->published_at->isFuture() ? 'scheduled' : 'published';
    }
}
