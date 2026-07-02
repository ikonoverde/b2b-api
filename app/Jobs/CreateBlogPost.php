<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;

class CreateBlogPost implements ShouldQueue
{
    public function handle(): void
    {
        Log::error('Create Blog Post');
    }
}
