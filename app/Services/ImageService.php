<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Interfaces\EncodedImageInterface;
use Intervention\Image\Interfaces\ImageInterface;
use InvalidArgumentException;
use Laravel\Ai\Files\Image as ReferenceImage;
use Laravel\Ai\Image;
use Laravel\Ai\PendingResponses\PendingImageGeneration;
use RuntimeException;
use Throwable;

class ImageService
{
    /**
     * @var list<string>
     */
    private const GENERATION_SIZES = ['1:1', '3:2', '2:3'];

    /**
     * @var list<string>
     */
    private const GENERATION_QUALITIES = ['low', 'medium', 'high'];

    /**
     * @var list<string>
     */
    private const OPTIMIZE_FORMATS = ['webp', 'jpeg', 'jpg', 'png'];

    /**
     * @var list<string>
     */
    private const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'avif'];

    /**
     * @var list<string>
     */
    private const COVER_POSITIONS = [
        'top-left', 'top', 'top-right',
        'left', 'center', 'right',
        'bottom-left', 'bottom', 'bottom-right',
    ];

    /**
     * @param  list<string>  $references
     * @return array{disk: string, path: string, url: string|null, mime: string, extension: string, before: int}
     */
    public function generate(
        string $prompt,
        string $size = '1:1',
        string $quality = 'high',
        ?string $provider = null,
        ?string $model = null,
        array $references = [],
        string $disk = 'public',
        string $path = 'ai-images',
        ?string $name = null,
    ): array {
        if (! in_array($size, self::GENERATION_SIZES, true)) {
            throw new InvalidArgumentException('Invalid --size. Use one of: 1:1, 3:2, 2:3.');
        }

        if (! in_array($quality, self::GENERATION_QUALITIES, true)) {
            throw new InvalidArgumentException('Invalid --quality. Use one of: low, medium, high.');
        }

        $referenceImages = [];

        foreach ($references as $referencePath) {
            if (! is_file($referencePath)) {
                throw new InvalidArgumentException("Reference image not found: {$referencePath}");
            }

            $referenceImages[] = ReferenceImage::fromPath($referencePath);
        }

        $response = Image::of($prompt)
            ->size($size)
            ->quality($quality)
            ->when($referenceImages !== [], fn (PendingImageGeneration $pending): PendingImageGeneration => $pending->attachments($referenceImages))
            ->generate($provider, $model);

        $firstImage = $response->firstImage();
        $extension = match ($firstImage->mime) {
            'image/jpeg' => 'jpg',
            'image/webp' => 'webp',
            default => 'png',
        };

        $storedPath = $response->storePubliclyAs(
            trim($path, '/'),
            ($name ?: Str::random(40)).'.'.$extension,
            $disk,
        );

        if ($storedPath === false) {
            throw new RuntimeException("Generated the image but failed to store it on the [{$disk}] disk.");
        }

        return [
            'disk' => $disk,
            'path' => $storedPath,
            'url' => $this->storageUrl($disk, $storedPath),
            'mime' => $firstImage->mime,
            'extension' => $extension,
            'before' => Storage::disk($disk)->size($storedPath),
        ];
    }

    /**
     * @return array{files: list<string>, results: list<array{file: string, before: int, after: int, destination: string}>, total_before: int, total_after: int}
     */
    public function optimize(
        string $path,
        ?string $format = null,
        int $quality = 80,
        ?int $maxWidth = null,
        ?string $cover = null,
        string $position = 'center',
        ?string $disk = null,
        ?string $output = null,
    ): array {
        if ($quality < 1 || $quality > 100) {
            throw new InvalidArgumentException('Invalid --quality. Use an integer between 1 and 100.');
        }

        if ($format !== null) {
            $format = strtolower($format);

            if (! in_array($format, self::OPTIMIZE_FORMATS, true)) {
                throw new InvalidArgumentException('Invalid --format. Use one of: webp, jpeg, png.');
            }
        }

        if ($cover !== null && $maxWidth !== null) {
            throw new InvalidArgumentException('Use either --cover or --max-width, not both.');
        }

        $coverDimensions = null;

        if ($cover !== null) {
            if (! preg_match('/^(\d+)x(\d+)$/', $cover, $matches)) {
                throw new InvalidArgumentException('Invalid --cover. Use WIDTHxHEIGHT, e.g. 1200x630.');
            }

            $coverDimensions = ['width' => (int) $matches[1], 'height' => (int) $matches[2]];
        }

        $position = strtolower($position);

        if (! in_array($position, self::COVER_POSITIONS, true)) {
            throw new InvalidArgumentException('Invalid --position. Use one of: '.implode(', ', self::COVER_POSITIONS).'.');
        }

        if ($maxWidth !== null && $maxWidth < 1) {
            throw new InvalidArgumentException('Invalid --max-width. Use a positive integer.');
        }

        $files = $this->resolveFiles($disk, $path);

        if ($files === null) {
            throw new InvalidArgumentException("Path not found: {$path}");
        }

        if ($files === []) {
            throw new InvalidArgumentException("No images found at: {$path}");
        }

        if ($output !== null && count($files) > 1) {
            throw new InvalidArgumentException('--output cannot be used when optimizing a directory.');
        }

        $manager = $this->imageManager();
        $results = [];
        $totalBefore = 0;
        $totalAfter = 0;

        foreach ($files as $file) {
            try {
                $result = $this->optimizeFile($manager, $disk, $file, $format, $quality, $coverDimensions, $position, $maxWidth, $output);
            } catch (Throwable $e) {
                throw new RuntimeException("Failed to optimize {$file}: ".$e->getMessage(), previous: $e);
            }

            $totalBefore += $result['before'];
            $totalAfter += $result['after'];
            $results[] = ['file' => $file, ...$result];
        }

        return [
            'files' => $files,
            'results' => $results,
            'total_before' => $totalBefore,
            'total_after' => $totalAfter,
        ];
    }

    public function storageUrl(string $disk, string $path): ?string
    {
        try {
            $url = Storage::disk($disk)->url($path);
        } catch (Throwable) {
            return null;
        }

        if (Str::startsWith($url, ['http://', 'https://'])) {
            return $url;
        }

        return url($url);
    }

    public function humanBytes(int $bytes): string
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

    public function savings(int $before, int $after): string
    {
        if ($before === 0) {
            return 'n/a';
        }

        $percent = (int) round(($before - $after) / $before * 100);

        return $after <= $before ? "-{$percent}%" : '+'.abs($percent).'% larger';
    }

    /**
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

    private function imageManager(): ImageManager
    {
        return config('image.driver') === 'imagick'
            ? ImageManager::imagick()
            : ImageManager::gd();
    }

    private function encode(ImageInterface $image, string $extension, int $quality): EncodedImageInterface
    {
        return match ($extension) {
            'webp' => $image->toWebp(quality: $quality),
            'jpg', 'jpeg' => $image->toJpeg(quality: $quality),
            'png' => $image->toPng(),
            default => $image->encodeByExtension($extension, quality: $quality),
        };
    }

    private function targetExtension(?string $format, string $sourceExtension): string
    {
        if ($format !== null) {
            return $format === 'jpeg' ? 'jpg' : $format;
        }

        return $sourceExtension;
    }

    private function destinationPath(string $file, string $sourceExtension, string $targetExtension): string
    {
        if ($targetExtension === $sourceExtension || $sourceExtension === '') {
            return $file;
        }

        return substr($file, 0, -strlen($sourceExtension)).$targetExtension;
    }

    private function isImage(string $file): bool
    {
        return in_array(strtolower(pathinfo($file, PATHINFO_EXTENSION)), self::IMAGE_EXTENSIONS, true);
    }
}
