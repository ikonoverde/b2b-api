<?php

namespace App\Models;

use Database\Factories\ReportFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * A free-text report an agent files during a run: a keyword research write-up today, and whatever other
 * specialists need to hand back later. Unlike {@see MarketingReport}, this carries no structured metrics
 * and drives no charts — it is the prose itself, kept as an artifact so the task that produced it can
 * show what was written.
 *
 * `type` names the kind of report, and every kind must appear in {@see self::TYPES} so it gets a readable
 * badge on the task details page. Adding a type there is what lets a new agent file its own reports.
 */
class Report extends Artifact
{
    /** @use HasFactory<ReportFactory> */
    use HasFactory;

    public const TYPE_KEYWORD_RESEARCH = 'keyword_research';

    /**
     * Report kinds and the Spanish badge each one shows. A type absent from this map is rejected before
     * it is stored, so the task page never has to render a report it cannot label.
     *
     * @var array<string, string>
     */
    public const TYPES = [
        self::TYPE_KEYWORD_RESEARCH => 'Investigación de keywords',
    ];

    protected $fillable = [
        'growth_task_id',
        'type',
        'agent',
        'title',
        'summary',
        'body',
    ];

    public function artifactLabel(): string
    {
        return self::TYPES[$this->type] ?? 'Reporte';
    }

    public function artifactTitle(): string
    {
        return $this->title;
    }

    public function adminUrl(): ?string
    {
        return "/admin/reports/{$this->id}";
    }
}
