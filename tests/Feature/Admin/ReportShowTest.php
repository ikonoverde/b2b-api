<?php

use App\Models\GrowthTask;
use App\Models\Report;
use App\Models\User;

function reportShowAdmin(): User
{
    return User::factory()->create(['role' => 'admin']);
}

it('keeps the report page behind the admin role', function () {
    $report = Report::factory()->create();

    $this->actingAs(User::factory()->create(['role' => 'customer']))
        ->get("/admin/reports/{$report->id}")
        ->assertForbidden();
});

it('renders a report with its body, badge, and metadata', function () {
    $report = Report::factory()->create([
        'type' => Report::TYPE_KEYWORD_RESEARCH,
        'title' => 'Investigación de keywords: aceites',
        'summary' => 'Clúster transaccional para spas.',
        'body' => '## Clúster principal',
        'agent' => 'keywords_specialist',
    ]);

    $this->actingAs(reportShowAdmin())
        ->get("/admin/reports/{$report->id}")
        ->assertInertia(fn ($page) => $page
            ->component('admin/reports/Show')
            ->where('report.id', $report->id)
            ->where('report.title', 'Investigación de keywords: aceites')
            ->where('report.type_label', 'Investigación de keywords')
            ->where('report.summary', 'Clúster transaccional para spas.')
            ->where('report.body', '## Clúster principal')
            ->where('report.agent', 'keywords_specialist')
            ->where('task', null));
});

it('links a report back to the task that produced it', function () {
    $task = GrowthTask::factory()->create(['name' => 'Investigar keywords de aceites']);
    $report = Report::factory()->create(['growth_task_id' => $task->id]);

    $this->actingAs(reportShowAdmin())
        ->get("/admin/reports/{$report->id}")
        ->assertInertia(fn ($page) => $page
            ->component('admin/reports/Show')
            ->where('task.id', $task->id)
            ->where('task.name', 'Investigar keywords de aceites'));
});
