<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Images an agent generated and a later tool has to find again.
 *
 * The image tool hands back a disk path, but a model will just as readily pass the public URL, the
 * absolute filesystem path, or the path with a `storage/` prefix it saw in a browser. All four mean
 * the same file. Accept them all, store the disk-relative one, and refuse a path that resolves to
 * nothing: a post whose image silently did not exist is a post that fails at Meta, in public.
 */
final class PublicImagePath
{
    /**
     * @var list<string>
     */
    public const EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp'];

    public function normalize(string $path): string
    {
        $publicRoot = Storage::disk('public')->path('');
        $normalizedPath = str_replace('\\', '/', $path);
        $normalizedPublicRoot = rtrim(str_replace('\\', '/', $publicRoot), '/').'/';

        if (str_starts_with($normalizedPath, $normalizedPublicRoot)) {
            $normalizedPath = substr($normalizedPath, strlen($normalizedPublicRoot));
        }

        return Str::of($normalizedPath)
            ->after(config('app.url').'/storage/')
            ->after('/storage/')
            ->after('storage/')
            ->ltrim('/')
            ->toString();
    }

    public function isValid(string $path): bool
    {
        if (! Storage::disk('public')->exists($path)) {
            return false;
        }

        return in_array(strtolower(pathinfo($path, PATHINFO_EXTENSION)), self::EXTENSIONS, true);
    }

    public function error(string $field): string
    {
        return sprintf(
            'The %s must reference an existing PNG, JPG, JPEG, or WebP image on the public storage disk.',
            $field,
        );
    }
}
