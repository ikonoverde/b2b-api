<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Interfaces\EncodedImageInterface;
use Intervention\Image\Interfaces\ImageInterface;
use RuntimeException;
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
     * Extensions treated as images when optimizing a directory.
     *
     * @var list<string>
     */
    private const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'avif'];

    /**
     * Valid crop anchors accepted by Intervention's cover() method.
     *
     * @var list<string>
     */
    private const COVER_POSITIONS = [
        'top-left', 'top', 'top-right',
        'left', 'center', 'right',
        'bottom-left', 'bottom', 'bottom-right',
    ];

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $quality = (int) $this->option('quality');

        if ($quality < 1 || $quality > 100) {
            $this->error('Invalid --quality. Use an integer between 1 and 100.');

            return self::INVALID;
        }

        $format = $this->option('format');

        if ($format !== null) {
            $format = strtolower($format);

            if (! in_array($format, ['webp', 'jpeg', 'jpg', 'png'], true)) {
                $this->error('Invalid --format. Use one of: webp, jpeg, png.');

                return self::INVALID;
            }
        }

        $coverOption = $this->option('cover');
        $maxWidthOption = $this->option('max-width');

        if ($coverOption !== null && $maxWidthOption !== null) {
            $this->error('Use either --cover or --max-width, not both.');

            return self::INVALID;
        }

        $cover = null;

        if ($coverOption !== null) {
            if (! preg_match('/^(\d+)x(\d+)$/', $coverOption, $matches)) {
                $this->error('Invalid --cover. Use WIDTHxHEIGHT, e.g. 1200x630.');

                return self::INVALID;
            }

            $cover = ['width' => (int) $matches[1], 'height' => (int) $matches[2]];
        }

        $position = strtolower((string) $this->option('position'));

        if (! in_array($position, self::COVER_POSITIONS, true)) {
            $this->error('Invalid --position. Use one of: '.implode(', ', self::COVER_POSITIONS).'.');

            return self::INVALID;
        }

        $maxWidth = null;

        if ($maxWidthOption !== null) {
            $maxWidth = (int) $maxWidthOption;

            if ($maxWidth < 1) {
                $this->error('Invalid --max-width. Use a positive integer.');

                return self::INVALID;
            }
        }

        $disk = $this->option('disk');
        $path = $this->argument('path');
        $files = $this->resolveFiles($disk, $path);

        if ($files === null) {
            $this->error("Path not found: {$path}");

            return self::INVALID;
        }

        if ($files === []) {
            $this->error("No images found at: {$path}");

            return self::INVALID;
        }

        $output = $this->option('output');

        if ($output !== null && count($files) > 1) {
            $this->error('--output cannot be used when optimizing a directory.');

            return self::INVALID;
        }

        $manager = $this->imageManager();
        $totalBefore = 0;
        $totalAfter = 0;

        foreach ($files as $file) {
            try {
                $result = $this->optimizeFile($manager, $disk, $file, $format, $quality, $cover, $position, $maxWidth, $output);
            } catch (Throwable $e) {
                $this->error("Failed to optimize {$file}: ".$e->getMessage());

                return self::FAILURE;
            }

            $totalBefore += $result['before'];
            $totalAfter += $result['after'];

            $this->line(sprintf(
                '  %s → %s  (%s → %s, %s)',
                $file,
                $result['destination'],
                $this->humanBytes($result['before']),
                $this->humanBytes($result['after']),
                $this->savings($result['before'], $result['after']),
            ));
        }

        $count = count($files);

        $this->info(sprintf(
            'Optimized %d image%s: %s → %s (%s)',
            $count,
            $count === 1 ? '' : 's',
            $this->humanBytes($totalBefore),
            $this->humanBytes($totalAfter),
            $this->savings($totalBefore, $totalAfter),
        ));

        return self::SUCCESS;
    }

    /**
     * Resolve the path to a list of image files, or null when the path is missing.
     *
     * @return list<string>|null
     */
    private function resolveFiles(?string $disk, string $path): ?array
    {
        if ($disk !== null) {
            $storage = Storage::disk($disk);

            if ($storage->fileExists($path)) {
                return [$path];
            }

            if ($storage->directoryExists($path)) {
                return array_values(array_filter(
                    $storage->files($path),
                    fn (string $file): bool => $this->isImage($file),
                ));
            }

            return null;
        }

        if (is_file($path)) {
            return [$path];
        }

        if (is_dir($path)) {
            $entries = array_map(
                fn (string $entry): string => rtrim($path, '/').'/'.$entry,
                array_diff(scandir($path) ?: [], ['.', '..']),
            );

            return array_values(array_filter(
                $entries,
                fn (string $file): bool => is_file($file) && $this->isImage($file),
            ));
        }

        return null;
    }

    /**
     * Optimize a single image file and write the result.
     *
     * @param  array{width: int, height: int}|null  $cover
     * @return array{before: int, after: int, destination: string}
     */
    private function optimizeFile(
        ImageManager $manager,
        ?string $disk,
        string $file,
        ?string $format,
        int $quality,
        ?array $cover,
        string $position,
        ?int $maxWidth,
        ?string $output,
    ): array {
        $contents = $disk !== null
            ? Storage::disk($disk)->get($file)
            : file_get_contents($file);

        if ($contents === null || $contents === false) {
            throw new RuntimeException("Could not read {$file}.");
        }

        $before = strlen($contents);
        $image = $manager->read($contents);

        if ($cover !== null) {
            $image->cover($cover['width'], $cover['height'], $position);
        } elseif ($maxWidth !== null) {
            $image->scaleDown(width: $maxWidth);
        }

        $sourceExtension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
        $targetExtension = $this->targetExtension($format, $sourceExtension);
        $encoded = $this->encode($image, $targetExtension, $quality);
        $after = strlen((string) $encoded);
        $destination = $output ?? $this->destinationPath($file, $sourceExtension, $targetExtension);

        $written = $disk !== null
            ? Storage::disk($disk)->put($destination, (string) $encoded)
            : file_put_contents($destination, (string) $encoded) !== false;

        if (! $written) {
            throw new RuntimeException("Could not write {$destination}.");
        }

        return ['before' => $before, 'after' => $after, 'destination' => $destination];
    }

    /**
     * Build the Intervention image manager for the configured driver.
     */
    private function imageManager(): ImageManager
    {
        return config('image.driver') === 'imagick'
            ? ImageManager::imagick()
            : ImageManager::gd();
    }

    /**
     * Encode the image to the given extension at the given quality.
     */
    private function encode(ImageInterface $image, string $extension, int $quality): EncodedImageInterface
    {
        return match ($extension) {
            'webp' => $image->toWebp(quality: $quality),
            'jpg', 'jpeg' => $image->toJpeg(quality: $quality),
            'png' => $image->toPng(),
            default => $image->encodeByExtension($extension, quality: $quality),
        };
    }

    /**
     * Resolve the output extension from the requested format or the source.
     */
    private function targetExtension(?string $format, string $sourceExtension): string
    {
        if ($format !== null) {
            return $format === 'jpeg' ? 'jpg' : $format;
        }

        return $sourceExtension;
    }

    /**
     * Resolve the destination path, swapping the extension when the format changes.
     */
    private function destinationPath(string $file, string $sourceExtension, string $targetExtension): string
    {
        if ($targetExtension === $sourceExtension || $sourceExtension === '') {
            return $file;
        }

        return substr($file, 0, -strlen($sourceExtension)).$targetExtension;
    }

    /**
     * Determine whether the file has a recognized image extension.
     */
    private function isImage(string $file): bool
    {
        return in_array(strtolower(pathinfo($file, PATHINFO_EXTENSION)), self::IMAGE_EXTENSIONS, true);
    }

    /**
     * Format a byte count for human-readable output.
     */
    private function humanBytes(int $bytes): string
    {
        if ($bytes < 1024) {
            return $bytes.' B';
        }

        $kilobytes = $bytes / 1024;

        if ($kilobytes < 1024) {
            return number_format($kilobytes, 1).' KB';
        }

        return number_format($kilobytes / 1024, 2).' MB';
    }

    /**
     * Describe the size change between the original and optimized image.
     */
    private function savings(int $before, int $after): string
    {
        if ($before === 0) {
            return 'n/a';
        }

        $percent = (int) round(($before - $after) / $before * 100);

        return $after <= $before ? "-{$percent}%" : '+'.abs($percent).'% larger';
    }
}
