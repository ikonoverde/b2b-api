<?php

use App\Jobs\CreateBlogPost;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Support\Facades\Queue;

it('dispatches the scheduled blog post job to the queue', function () {
    Queue::fake();

    $event = collect(app(Schedule::class)->events())
        ->firstWhere(fn ($event) => $event->description === 'create.blog.post');

    expect($event)->not->toBeNull();

    $event->run(app());

    Queue::assertPushed(CreateBlogPost::class);
});
