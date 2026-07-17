<?php

namespace App\Ai\Tools\Marketing;

use App\Ai\Tools\Ads\Concerns\FormatsToolResponses;
use App\Services\MarketingReportService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use Stringable;

class GetMarketingReports implements Tool
{
    use FormatsToolResponses;

    public function __construct(private MarketingReportService $reports) {}

    public function name(): string
    {
        return 'marketing_get_reports';
    }

    public function description(): Stringable|string
    {
        return 'Read past marketing status reports: the most recent few, or one specific date in full. Use this before writing a new report, to see what was true when it was written. These are not a source of current numbers — every value in a new report must come from a tool call made on that run, never copied forward from here.';
    }

    public function handle(Request $request): Stringable|string
    {
        $reportedOn = $request->string('reported_on')->toString();

        if ($reportedOn !== '') {
            return $this->json($this->reports->show($reportedOn));
        }

        $limit = $request->integer('limit') ?: 4;

        return $this->json($this->reports->recent(
            limit: $limit,
            withBody: $request->boolean('with_body'),
        ));
    }

    /**
     * @return array<string, Type>
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'reported_on' => $schema->string()
                ->nullable()
                ->description('Return one report in full, by the date it was written (YYYY-MM-DD), including every tagged value it recorded. Omit to list the most recent reports instead.'),
            'limit' => $schema->integer()
                ->nullable()
                ->description('How many recent reports to list. Defaults to 4.'),
            'with_body' => $schema->boolean()
                ->nullable()
                ->description('Include the full markdown of each listed report. Defaults to false, which returns headline values only.'),
        ];
    }
}
