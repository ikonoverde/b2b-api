<?php

namespace App\Http\Controllers\Web\Blog;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use Inertia\Inertia;
use Inertia\Response;

class IndexBlogPostsController extends Controller
{
    public function __invoke(): Response
    {
        $posts = BlogPost::query()
            ->published()
            ->orderByDesc('published_at')
            ->paginate(9)
            ->through(fn (BlogPost $post) => [
                'id' => $post->id,
                'title' => $post->title,
                'slug' => $post->slug,
                'excerpt' => $post->excerpt,
                'cover_image_url' => $post->cover_image_url,
                'published_at' => $post->published_at?->toISOString(),
            ]);

        return Inertia::render('Blog/Index', [
            'posts' => $posts,
        ]);
    }
}
