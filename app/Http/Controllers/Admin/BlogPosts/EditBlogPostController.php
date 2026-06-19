<?php

namespace App\Http\Controllers\Admin\BlogPosts;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use Inertia\Inertia;
use Inertia\Response;

class EditBlogPostController extends Controller
{
    public function __invoke(BlogPost $blogPost): Response
    {
        return Inertia::render('admin/blog-posts/Edit', [
            'post' => [
                'id' => $blogPost->id,
                'title' => $blogPost->title,
                'slug' => $blogPost->slug,
                'excerpt' => $blogPost->excerpt,
                'content' => $blogPost->content,
                'cover_image_url' => $blogPost->cover_image_url,
                'is_published' => $blogPost->is_published,
                'published_at' => $blogPost->published_at?->toISOString(),
            ],
        ]);
    }
}
