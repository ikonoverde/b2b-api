<?php

namespace App\Http\Controllers\Admin\Reports;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Inertia\Inertia;
use Inertia\Response;

/**
 * One report, read whole: the prose an agent filed, with the growth task that produced it linked back so
 * a reader can return to the work it belongs to. Reached from the artifacts list on the task page.
 */
class ShowReportController extends Controller
{
    public function __invoke(Report $report): Response
    {
        $report->load('growthTask:id,name');

        return Inertia::render('admin/reports/Show', [
            'report' => [
                'id' => $report->id,
                'type' => $report->type,
                'type_label' => $report->artifactLabel(),
                'title' => $report->title,
                'summary' => $report->summary,
                'body' => $report->body,
                'agent' => $report->agent,
                'created_at' => $report->created_at?->toISOString(),
            ],
            'task' => $report->growthTask === null ? null : [
                'id' => $report->growthTask->id,
                'name' => $report->growthTask->name,
            ],
        ]);
    }
}
