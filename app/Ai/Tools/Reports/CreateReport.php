<?php

namespace App\Ai\Tools\Reports;

use App\Ai\Tools\Ads\Concerns\FormatsToolResponses;
use App\Ai\Tools\SaveMarketingReport;
use App\Models\Report;
use App\Services\Reports\ReportService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;
use Illuminate\Support\Facades\Validator;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use Stringable;

/**
 * Files an agent's free-text report as an artifact.
 *
 * A report is prose a human reads, not a number a later run chains on — that is what separates it from
 * {@see SaveMarketingReport}, which records tagged metrics. Every specialist that needs to
 * hand back a written analysis can share this one tool; the `type` names which kind, and the model that
 * produced it decides the words. During a growth task run the artifact links itself to that task, so the
 * work shows up on the task's details page without the tool passing the task through.
 */
class CreateReport implements Tool
{
    use FormatsToolResponses;

    public function __construct(private ReportService $reports) {}

    public function name(): string
    {
        return 'report_create';
    }

    public function description(): Stringable|string
    {
        return 'File a written report to the internal record: a title, an optional one-line summary, and the full report as markdown. Use it to hand back an analysis a human will read, such as keyword research. It stores prose, not metrics, and it publishes nothing. When a growth task triggered your run, the report is linked to that task so a human can find it there. Keep any provenance tags (OBSERVED, ESTIMATED, ASSUMED) in the body.';
    }

    public function handle(Request $request): Stringable|string
    {
        $validator = Validator::make(
            $this->reports->normalize($request->all()),
            $this->reports->rules(),
            $this->reports->messages(),
        );

        if ($validator->fails()) {
            return $this->json(['error' => $validator->errors()->first()]);
        }

        /** @var array<string, mixed> $validated */
        $validated = $validator->validated();

        return $this->json($this->reports->payload($this->reports->create($validated)));
    }

    /**
     * @return array<string, Type>
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'type' => $schema->string()
                ->enum(array_keys(Report::TYPES))
                ->description('The kind of report. Use '.Report::TYPE_KEYWORD_RESEARCH.' for keyword research.')
                ->required(),
            'title' => $schema->string()
                ->description('A short title for the report.')
                ->required(),
            'summary' => $schema->string()
                ->nullable()
                ->description('An optional one-line summary shown before the full report is opened. Write it as a standalone takeaway.'),
            'body' => $schema->string()
                ->description('The full report as markdown, exactly as it should be read. Keep provenance tags in place: an ESTIMATED figure stripped of its tag reads as a measured one.')
                ->required(),
            'agent' => $schema->string()
                ->nullable()
                ->description('The specialist filing the report, such as keywords_specialist. Omit if unsure.'),
        ];
    }
}
