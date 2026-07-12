<?php

namespace Database\Factories;

use App\Models\SocialPostDraft;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SocialPostDraft>
 */
class SocialPostDraftFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'platform' => SocialPostDraft::PLATFORM_FACEBOOK,
            'status' => SocialPostDraft::STATUS_PENDING,
            'caption' => 'Aceite de masaje profesional en presentación de 5 L. Deslizamiento prolongado y absorción gradual, sin residuo graso.',
            'image_path' => null,
            'link' => null,
            'rationale' => 'Formato 5 L para compradores profesionales que comparan costo por sesión.',
            'brand_review' => null,
            'proposed_for' => null,
            'created_by_agent' => true,
        ];
    }

    public function instagram(): static
    {
        return $this->state(fn (): array => [
            'platform' => SocialPostDraft::PLATFORM_INSTAGRAM,
            'image_path' => 'social/posts/aceite-5l.webp',
        ]);
    }

    /**
     * A draft Meta accepted. published_at and remote_post_id arrive together, because only a
     * confirmed response may produce either.
     */
    public function published(): static
    {
        return $this->state(fn (): array => [
            'status' => SocialPostDraft::STATUS_PUBLISHED,
            'published_at' => now(),
            'remote_post_id' => '1234567890_9876543210',
            'remote_permalink' => 'https://facebook.com/1234567890_9876543210',
            'reviewed_by_user_id' => User::factory()->admin(),
            'reviewed_at' => now(),
        ]);
    }

    /**
     * We called Meta and Meta refused. Nothing is public, so there is no published_at and no id.
     */
    public function failed(string $error = 'Meta Graph returned an error: invalid access token.'): static
    {
        return $this->state(fn (): array => [
            'status' => SocialPostDraft::STATUS_FAILED,
            'publish_error' => $error,
            'reviewed_by_user_id' => User::factory()->admin(),
            'reviewed_at' => now(),
        ]);
    }

    public function rejected(string $reason = 'El precio no va en la copia.'): static
    {
        return $this->state(fn (): array => [
            'status' => SocialPostDraft::STATUS_REJECTED,
            'rejection_reason' => $reason,
            'reviewed_by_user_id' => User::factory()->admin(),
            'reviewed_at' => now(),
        ]);
    }
}
