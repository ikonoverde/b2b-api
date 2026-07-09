<?php

namespace App\Mcp\Tools;

use App\Services\MarketingSalesSummaryService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\ResponseFactory;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Attributes\Title;
use Laravel\Mcp\Server\Tool;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

#[Name('marketing-sales-summary')]
#[Title('Marketing Sales Summary')]
#[Description('Return read-only product sales performance for marketing planning, including completed non-cancelled orders, revenue, quantity sold, average order value, and top products.')]
#[IsReadOnly]
class MarketingSalesSummary extends Tool
{
    public function __construct(private MarketingSalesSummaryService $sales) {}

    /**
     * Handle the tool request.
     */
    public function handle(Request $request): Response|ResponseFactory
    {
        $user = $request->user();

        if ($user === null || ! in_array($user->role, ['admin', 'super_admin'], true)) {
            return Response::error('Permission denied.');
        }

        $validated = $request->validate([
            'start_date' => ['nullable', 'date_format:Y-m-d'],
            'end_date' => ['nullable', 'date_format:Y-m-d', 'after_or_equal:start_date'],
            'limit' => ['nullable', 'integer', 'min:1', 'max:50'],
        ], [
            'end_date.after_or_equal' => 'The end_date must be on or after start_date.',
        ]);

        return Response::structured($this->sales->build($validated));
    }

    /**
     * Get the tool's input schema.
     *
     * @return array<string, Type>
     */
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

    /**
     * @return array<string, Type>
     */
    public function outputSchema(JsonSchema $schema): array
    {
        return [
            'date_range' => $schema->object([
                'start_date' => $schema->string()->description('Inclusive start date.')->required(),
                'end_date' => $schema->string()->description('Inclusive end date.')->required(),
            ])->description('The date range the summary covers.')->required(),
            'filters' => $schema->object([
                'payment_status' => $schema->string()->description('Payment status orders were filtered by.')->required(),
                'excluded_order_statuses' => $schema->array()->items($schema->string())->description('Order statuses excluded from the summary.')->required(),
                'limit' => $schema->integer()->description('Applied maximum top product count.')->required(),
            ])->description('The filters applied to the sales query.')->required(),
            'summary' => $schema->object([
                'order_count' => $schema->integer()->description('Number of qualifying orders.')->required(),
                'total_revenue' => $schema->number()->description('Total revenue across qualifying orders.')->required(),
                'average_order_value' => $schema->number()->description('Total revenue divided by order count, or 0 when there are no orders.')->required(),
            ])->description('Aggregate order performance.')->required(),
            'top_products' => $schema->array()->items($schema->object([
                'product_id' => $schema->integer()->nullable()->description('Product ID, null when the product no longer exists.'),
                'product_name' => $schema->string()->description('Product name at time of sale.')->required(),
                'sku' => $schema->string()->nullable()->description('Product SKU.'),
                'slug' => $schema->string()->nullable()->description('Product URL slug.'),
                'category' => $schema->string()->nullable()->description('Category name.'),
                'quantity_sold' => $schema->integer()->description('Units sold in the date range.')->required(),
                'revenue' => $schema->number()->description('Revenue attributed to the product.')->required(),
                'order_count' => $schema->integer()->description('Distinct orders containing the product.')->required(),
            ]))->description('Top products by revenue, descending.')->required(),
        ];
    }
}
