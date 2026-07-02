<?php

use App\Jobs\CreateBlogPost;
use Illuminate\Support\Facades\Schedule;

Schedule::command('horizon:snapshot')
    ->name('horizon.snapshot')
    ->everyFiveMinutes();

Schedule::job(new CreateBlogPost)
    ->name('create.blog.post')
    ->daily();
