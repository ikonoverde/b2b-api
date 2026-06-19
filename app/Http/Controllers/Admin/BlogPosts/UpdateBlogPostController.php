<?php

namespace App\Http\Controllers\Admin\BlogPosts;

use App\Http\Controllers\Controller;
use App\Http\Requests\Web\Content\UpdateBlogPostRequest;
use App\Models\BlogPost;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;

class UpdateBlogPostController extends Controller
{
    public function __invoke(UpdateBlogPostRequest $request, BlogPost $blogPost): RedirectResponse
    {
        $data = $request->safe()->except('cover_image');

        if ($request->hasFile('cover_image')) {
            if ($blogPost->cover_image_path) {
                Storage::disk('public')->delete($blogPost->cover_image_path);
            }

            $data['cover_image_path'] = $request->file('cover_image')->store('blog/covers', 'public');
        }

        $blogPost->update($data);

        return redirect()->route('admin.blog-posts')
            ->with('success', 'Entrada de blog actualizada exitosamente.');
    }
}
