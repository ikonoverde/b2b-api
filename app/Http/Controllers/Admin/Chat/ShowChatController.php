<?php

namespace App\Http\Controllers\Admin\Chat;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class ShowChatController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('admin/chat/Index');
    }
}
