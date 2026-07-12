<?php

namespace App\Services\Social;

use App\Models\SocialPostDraft;
use RuntimeException;

/**
 * Someone, or something, got to this draft before this request did.
 *
 * Thrown from inside the locked claim, which is the only place that can tell the difference between
 * "this draft is available" and "another request is already sending it to Meta". Every caller has to
 * treat this as a stop, never as a reason to try again.
 */
class SocialPostAlreadyHandled extends RuntimeException
{
    public function __construct(public readonly string $status)
    {
        parent::__construct(match ($status) {
            SocialPostDraft::STATUS_PUBLISHING => 'This post is already being sent to Meta. Wait for it to finish rather than sending it twice.',
            SocialPostDraft::STATUS_PUBLISHED => 'This post has already been published to Meta.',
            SocialPostDraft::STATUS_REJECTED => 'This post was rejected and cannot be published.',
            SocialPostDraft::STATUS_FAILED => 'This post already failed to publish. Create a new draft rather than retrying this one.',
            default => 'This post is no longer waiting for review.',
        });
    }
}
