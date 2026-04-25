<?php

namespace App\Jobs;

use App\Models\BusinessScrapeRun;
use App\Services\OutscraperService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class StartBusinessScrape implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    /** @var array<int, int> */
    public array $backoff = [30, 60, 120];

    public function __construct(public BusinessScrapeRun $scrapeRun)
    {
        $this->afterCommit();
    }

    public function handle(OutscraperService $outscraper): void
    {
        $queries = $this->buildQueries();

        $requestId = $outscraper->startSearch(
            queries: $queries,
            language: 'es',
            region: 'MX',
            limit: 100,
        );

        if (! $requestId) {
            throw new \RuntimeException('Outscraper failed to start search request');
        }

        $this->scrapeRun->markRunning($requestId);

        PollBusinessScrapeStatus::dispatch($this->scrapeRun)
            ->delay(now()->addSeconds(30));
    }

    public function failed(\Throwable $e): void
    {
        Log::error('StartBusinessScrape job failed', [
            'scrape_run_id' => $this->scrapeRun->id,
            'message' => $e->getMessage(),
        ]);

        $this->scrapeRun->markFailed($e->getMessage());
    }

    /**
     * @return array<int, string>
     */
    private function buildQueries(): array
    {
        $terms = array_filter(array_map('trim', explode(',', $this->scrapeRun->search_terms)));
        $location = trim($this->scrapeRun->location);

        return array_values(array_map(
            fn (string $term) => "{$term}, {$location}",
            $terms,
        ));
    }
}
