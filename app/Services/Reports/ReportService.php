<?php

namespace App\Services\Reports;

use App\Models\Report;
use Illuminate\Validation\Rule;

/**
 * Shapes and stores an agent's free-text report. The report is prose, not metrics: it is kept so a human
 * can read what a specialist concluded, and so the growth task that triggered the run can show it was
 * filed. Nothing here publishes anything or feeds a downstream calculation.
 */
class ReportService
{
    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'type' => ['required', 'string', Rule::in(array_keys(Report::TYPES))],
            'agent' => ['nullable', 'string', 'max:255'],
            'title' => ['required', 'string', 'max:255'],
            'summary' => ['nullable', 'string', 'max:1000'],
            'body' => ['required', 'string'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'type.required' => 'Name the kind of report, such as '.Report::TYPE_KEYWORD_RESEARCH.'.',
            'type.in' => 'That is not a report kind this application stores. Known kinds: '.implode(', ', array_keys(Report::TYPES)).'.',
            'title.required' => 'Give the report a title.',
            'body.required' => 'Write the report body as non-empty markdown.',
        ];
    }

    /**
     * @param  array<string, mixed>  $arguments
     * @return array<string, mixed>
     */
    public function normalize(array $arguments): array
    {
        foreach (['type', 'agent', 'title', 'summary', 'body'] as $key) {
            if (array_key_exists($key, $arguments) && is_string($arguments[$key])) {
                $arguments[$key] = trim($arguments[$key]) === '' ? null : trim($arguments[$key]);
            }
        }

        return $arguments;
    }

    /**
     * @param  array<string, mixed>  $validated
     */
    public function create(array $validated): Report
    {
        return Report::create([
            'type' => $validated['type'],
            'agent' => $validated['agent'] ?? null,
            'title' => $validated['title'],
            'summary' => $validated['summary'] ?? null,
            'body' => $validated['body'],
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function payload(Report $report): array
    {
        return [
            'id' => $report->id,
            'type' => $report->type,
            'title' => $report->title,
            'summary' => $report->summary,
            'created_at' => $report->created_at?->toISOString(),
            'saved' => true,
            'note' => 'The report is filed to the internal record. It is not published anywhere a customer can see, and if this run was triggered by a growth task it is now linked to that task for a human to read.',
        ];
    }
}
