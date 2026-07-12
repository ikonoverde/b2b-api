<?php

namespace App\Http\Controllers\Admin\SocialPosts;

use App\Http\Controllers\Admin\SocialPosts\Concerns\BuildsSocialPostShowResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SocialPosts\RejectSocialPostDraftRequest;
use App\Models\SocialPostDraft;
use Inertia\Response;

class RejectSocialPostDraftController extends Controller
{
    use BuildsSocialPostShowResponse;

    public function __invoke(RejectSocialPostDraftRequest $request, SocialPostDraft $socialPostDraft): Response
    {
        if (! $socialPostDraft->isPending()) {
            return $this->renderSocialPostShow($socialPostDraft, 'error', 'Este borrador ya no está en revisión.');
        }

        $socialPostDraft->update([
            'status' => SocialPostDraft::STATUS_REJECTED,
            'rejection_reason' => $request->validated('rejection_reason'),
            'reviewed_by_user_id' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        return $this->renderSocialPostShow($socialPostDraft, 'success', 'Borrador descartado. No se envió nada a Meta.');
    }
}
