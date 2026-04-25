<?php

namespace App\Jobs;

use App\Models\BusinessScrapeRun;
use App\Services\OutscraperService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class PollBusinessScrapeStatus implements ShouldQueue
{
    use Queueable;

    public int $tries = 60;

    public function __construct(public BusinessScrapeRun $scrapeRun) {}

    public function handle(OutscraperService $outscraper): void
    {
        $result = $outscraper->getRequestStatus($this->scrapeRun->outscraper_request_id);

        if (! $result) {
            $this->release(30);

            return;
        }

        $status = $result['status'];

        if ($status === 'Success') {
            $this->scrapeRun->markCollecting();

            ImportBusinessResults::dispatch($this->scrapeRun);

            return;
        }

        if ($status === 'Failed') {
            $this->scrapeRun->markFailed("Outscraper request ended with status: {$status}");

            return;
        }

        $this->release(30);
    }

    public function failed(\Throwable $e): void
    {
        Log::error('PollBusinessScrapeStatus job failed', [
            'scrape_run_id' => $this->scrapeRun->id,
            'message' => $e->getMessage(),
        ]);

        $this->scrapeRun->markFailed($e->getMessage());
    }
}
