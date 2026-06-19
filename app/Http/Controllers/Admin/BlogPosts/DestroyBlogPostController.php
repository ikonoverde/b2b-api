<?php

namespace App\Http\Controllers\Admin\BlogPosts;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;

class DestroyBlogPostController extends Controller
{
    public function __invoke(BlogPost $blogPost): RedirectResponse
    {
        if ($blogPost->cover_image_path) {
            Storage::disk('public')->delete($blogPost->cover_image_path);
        }

        $blogPost->delete();

        return redirect()->route('admin.blog-posts')
            ->with('success', 'Entrada de blog eliminada exitosamente.');
    }
}
