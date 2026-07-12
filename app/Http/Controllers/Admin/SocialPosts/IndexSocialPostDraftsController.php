<?php

namespace App\Http\Controllers\Admin\SocialPosts;

use App\Http\Controllers\Controller;
use App\Models\SocialPostDraft;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndexSocialPostDraftsController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $status = $request->string('status')->toString();

        if (! in_array($status, SocialPostDraft::STATUSES, true)) {
            $status = '';
        }

        $drafts = SocialPostDraft::query()
            ->with('reviewer:id,name')
            ->when($status !== '', fn ($query) => $query->where('status', $status))
            ->orderByDesc('id')
            ->paginate(20)
            ->through(fn (SocialPostDraft $draft): array => [
                'id' => $draft->id,
                'platform' => $draft->platform,
                'status' => $draft->status,
                'caption' => $draft->caption,
                'image_url' => $draft->imageUrl(),
                'proposed_for' => $draft->proposed_for?->toISOString(),
                'published_at' => $draft->published_at?->toISOString(),
                'remote_permalink' => $draft->remote_permalink,
                'reviewer' => $draft->reviewer?->name,
                'created_at' => $draft->created_at?->toISOString(),
            ])
            ->withQueryString();

        return Inertia::render('admin/social-posts/Index', [
            'drafts' => $drafts,
            'filters' => ['status' => $status],
            'pendingCount' => SocialPostDraft::query()->pending()->count(),
        ]);
    }
}
