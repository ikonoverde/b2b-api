<?php

use App\Jobs\CreateBlogPost;
use App\Jobs\GenerateMarketingReport;
use Illuminate\Support\Facades\Schedule;

Schedule::command('horizon:snapshot')
    ->name('horizon.snapshot')
    ->everyFiveMinutes();

Schedule::job(new CreateBlogPost)
    ->name('create.blog.post')
    ->daily();

/**
 * Early morning in store time, so yesterday is closed and GA4 has had its processing lag — GA4 can
 * take 4 to 24 hours to settle, and a report run at midnight describes a day the API cannot see yet.
 */
Schedule::job(new GenerateMarketingReport)
    ->name('marketing.report')
    ->dailyAt('07:00')
    ->timezone(config('shop.timezone'))
    ->withoutOverlapping();
