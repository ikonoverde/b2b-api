<?php

namespace App\Ai\Tools\Ads\Concerns;

trait FormatsToolResponses
{
    /**
     * @param  array<string, mixed>  $payload
     */
    protected function json(array $payload): string
    {
        return json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
    }
}
