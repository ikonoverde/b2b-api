<?php

namespace App\Console\Commands;

use App\Services\ImageService;
use Illuminate\Console\Command;
use InvalidArgumentException;
use Throwable;

class OptimizeImageCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'image:optimize
        {path : Image file to optimize, or a directory to optimize every image within}
        {--format= : Convert output to webp, jpeg, or png; defaults to keeping the source format}
        {--quality=80 : Encoding quality (1-100) for lossy formats}
        {--max-width= : Downscale images wider than this many pixels, preserving aspect ratio}
        {--cover= : Resize and crop to exact dimensions, e.g. 1200x630}
        {--position=center : Crop anchor for --cover: top-left, top, top-right, left, center, right, bottom-left, bottom, bottom-right}
        {--disk= : Filesystem disk to read from and write to; omit to use local filesystem paths}
        {--output= : Destination path for a single file; defaults to optimizing in place}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Optimize and convert images with Intervention Image (resize, recompress, change format)';

    /**
     * Execute the console command.
     */
    public function handle(ImageService $images): int
    {
        try {
            $report = $images->optimize(
                path: $this->argument('path'),
                format: $this->option('format') !== null ? (string) $this->option('format') : null,
                quality: (int) $this->option('quality'),
                maxWidth: $this->option('max-width') !== null ? (int) $this->option('max-width') : null,
                cover: $this->option('cover') !== null ? (string) $this->option('cover') : null,
                position: (string) $this->option('position'),
                disk: $this->option('disk') !== null ? (string) $this->option('disk') : null,
                output: $this->option('output') !== null ? (string) $this->option('output') : null,
            );
        } catch (InvalidArgumentException $e) {
            $this->error($e->getMessage());

            return self::INVALID;
        } catch (Throwable $e) {
            $this->error($e->getMessage());

            return self::FAILURE;
        }

        foreach ($report['results'] as $result) {
            $this->line(sprintf(
                '  %s → %s  (%s → %s, %s)',
                $result['file'],
                $result['destination'],
                $images->humanBytes($result['before']),
                $images->humanBytes($result['after']),
                $images->savings($result['before'], $result['after']),
            ));
        }

        $count = count($report['files']);

        $this->info(sprintf(
            'Optimized %d image%s: %s → %s (%s)',
            $count,
            $count === 1 ? '' : 's',
            $images->humanBytes($report['total_before']),
            $images->humanBytes($report['total_after']),
            $images->savings($report['total_before'], $report['total_after']),
        ));

        return self::SUCCESS;
    }
}
