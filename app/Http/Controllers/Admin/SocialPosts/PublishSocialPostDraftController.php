<?php

namespace App\Http\Controllers\Admin\SocialPosts;

use App\Http\Controllers\Admin\SocialPosts\Concerns\BuildsSocialPostShowResponse;
use App\Http\Controllers\Controller;
use App\Models\SocialPostDraft;
use App\Services\Social\SocialPostAlreadyHandled;
use App\Services\Social\SocialPostPublisher;
use Illuminate\Http\Request;
use Inertia\Response;
use RuntimeException;

/**
 * The single door between this application and the brand's public accounts.
 *
 * It is reached only by an admin clicking publish on a draft they have read. No agent, no tool, and
 * no queued job can arrive here.
 */
class PublishSocialPostDraftController extends Controller
{
    use BuildsSocialPostShowResponse;

    public function __invoke(
        Request $request,
        SocialPostDraft $socialPostDraft,
        SocialPostPublisher $publisher,
    ): Response {
        try {
            $draft = $publisher->publish($socialPostDraft, $request->user()->id);
        } catch (SocialPostAlreadyHandled $exception) {
            return $this->renderSocialPostShow($socialPostDraft->refresh(), 'error', $exception->getMessage());
        } catch (RuntimeException $exception) {
            return $this->renderSocialPostShow($socialPostDraft->refresh(), 'error', $exception->getMessage());
        }

        if ($draft->isPublished()) {
            return $this->renderSocialPostShow($draft, 'success', 'Publicado. La publicación ya es pública y no se puede deshacer desde aquí.');
        }

        return $this->renderSocialPostShow($draft, 'error', 'Meta rechazó la publicación. No se publicó nada. '.($draft->publish_error ?? ''));
    }
}
