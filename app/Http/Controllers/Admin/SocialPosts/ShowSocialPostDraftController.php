<?php

namespace App\Http\Controllers\Admin\SocialPosts;

use App\Http\Controllers\Admin\SocialPosts\Concerns\BuildsSocialPostShowResponse;
use App\Http\Controllers\Controller;
use App\Models\SocialPostDraft;
use Inertia\Response;

class ShowSocialPostDraftController extends Controller
{
    use BuildsSocialPostShowResponse;

    public function __invoke(SocialPostDraft $socialPostDraft): Response
    {
        return $this->renderSocialPostShow($socialPostDraft);
    }
}
