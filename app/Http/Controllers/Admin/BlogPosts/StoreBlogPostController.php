<?php

namespace App\Http\Controllers\Admin\BlogPosts;

use App\Http\Controllers\Controller;
use App\Http\Requests\Web\Content\StoreBlogPostRequest;
use App\Models\BlogPost;
use Illuminate\Http\RedirectResponse;

class StoreBlogPostController extends Controller
{
    public function __invoke(StoreBlogPostRequest $request): RedirectResponse
    {
        $data = $request->safe()->except('cover_image');

        if ($request->hasFile('cover_image')) {
            $data['cover_image_path'] = $request->file('cover_image')->store('blog/covers', 'public');
        }

        BlogPost::create($data);

        return redirect()->route('admin.blog-posts')
            ->with('success', 'Entrada de blog creada exitosamente.');
    }
}
