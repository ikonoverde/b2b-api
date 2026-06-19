<?php

namespace Database\Factories;

use App\Models\BlogPost;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<BlogPost>
 */
class BlogPostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->sentence(5);

        return [
            'title' => $title,
            'slug' => fake()->unique()->slug(4),
            'excerpt' => fake()->paragraph(),
            'content' => implode("\n\n", fake()->paragraphs(5)),
            'cover_image_path' => null,
            'is_published' => true,
            'published_at' => fake()->dateTimeBetween('-6 months', '-1 day'),
        ];
    }

    public function unpublished(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_published' => false,
            'published_at' => null,
        ]);
    }

    public function scheduled(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_published' => true,
            'published_at' => fake()->dateTimeBetween('+1 day', '+1 month'),
        ]);
    }

    public function withCoverImage(): static
    {
        return $this->state(fn (array $attributes) => [
            'cover_image_path' => 'blog/covers/sample-cover.jpg',
        ]);
    }
}
