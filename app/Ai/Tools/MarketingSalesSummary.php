<?php

namespace App\Ai\Tools;

use App\Services\MarketingSalesSummaryService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use Stringable;

class MarketingSalesSummary implements Tool
{
    public function __construct(private MarketingSalesSummaryService $sales) {}

    public function name(): string
    {
        return 'marketing_sales_summary';
    }

    public function description(): Stringable|string
    {
        return 'Return read-only product sales performance for marketing planning, including completed non-cancelled orders, revenue, quantity sold, average order value, and top products.';
    }

    public function handle(Request $request): Stringable|string
    {
        return json_encode(
            $this->sales->build($request->all()),
            JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR,
        );
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'start_date' => $schema->string()
                ->nullable()
                ->description('Optional start date in YYYY-MM-DD format. Defaults to 30 days ago.'),
            'end_date' => $schema->string()
                ->nullable()
                ->description('Optional end date in YYYY-MM-DD format. Defaults to today.'),
            'limit' => $schema->integer()
                ->nullable()
                ->description('Maximum top products to return. Defaults to 10 and caps at 50.'),
        ];
    }
}
