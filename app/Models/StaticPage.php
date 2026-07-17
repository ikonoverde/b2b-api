<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class StaticPage extends Artifact
{
    use HasFactory;

    protected $fillable = [
        'growth_task_id',
        'slug',
        'title',
        'content',
        'is_published',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
        ];
    }

    public function artifactLabel(): string
    {
        return 'Página estática';
    }

    public function artifactTitle(): string
    {
        return $this->title;
    }

    public function adminUrl(): ?string
    {
        return "/admin/static-pages/{$this->id}/edit";
    }
}
