<?php

namespace App\Http\Controllers\Admin\BlogPosts;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class CreateBlogPostController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('admin/blog-posts/Create');
    }
}
