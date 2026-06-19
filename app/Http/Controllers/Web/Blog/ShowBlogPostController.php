<?php

namespace App\Http\Controllers\Web\Blog;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use Inertia\Inertia;
use Inertia\Response;

class ShowBlogPostController extends Controller
{
    public function __invoke(BlogPost $blogPost): Response
    {
        abort_unless($blogPost->isPubliclyVisible(), 404);

        return Inertia::render('Blog/Show', [
            'post' => [
                'id' => $blogPost->id,
                'title' => $blogPost->title,
                'slug' => $blogPost->slug,
                'excerpt' => $blogPost->excerpt,
                'content' => $blogPost->content,
                'cover_image_url' => $blogPost->cover_image_url,
                'published_at' => $blogPost->published_at?->toISOString(),
            ],
        ]);
    }
}
