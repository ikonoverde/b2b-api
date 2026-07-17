<?php

namespace App\Console\Commands;

use App\Services\Ads\MetaGraphService;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('debug')]
#[Description('Scratch command for ad-hoc debugging; implementation changes as needed.')]
class Debug extends Command
{
    public function handle(MetaGraphService $meta): int
    {
        $token = (string) config('services.meta_graph.access_token');

        $this->info('=== Meta Graph config ===');
        $this->table(['key', 'value'], [
            ['access_token', $token === '' ? 'MISSING' : substr($token, 0, 6).'…'.substr($token, -4).' (len '.strlen($token).')'],
            ['api_version', config('services.meta_graph.api_version')],
            ['base_url', config('services.meta_graph.base_url')],
            ['page_id', config('services.meta_graph.page_id') ?: 'MISSING'],
            ['instagram_business_account_id', config('services.meta_graph.instagram_business_account_id') ?: 'MISSING'],
        ]);

        $this->info('=== pageInfo() — same call the agents make ===');
        $test = $meta->pageInfo();
        dump($test);

        $this->info('=== instagramAccountInfo() ===');
        $test2 = $meta->instagramAccountInfo();
        dump($test2);

        return self::SUCCESS;
    }
}
