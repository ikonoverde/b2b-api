<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use PharData;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use Throwable;

class UpdateGeoIpDatabaseCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'geoip:update
        {--license-key= : MaxMind license key; defaults to MAXMIND_LICENSE_KEY}
        {--edition=GeoLite2-City : MaxMind database edition to download}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Download and install the MaxMind GeoLite2 database used for visitor geolocation';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $licenseKey = trim((string) ($this->option('license-key') ?: config('shop.visitor_location.license_key')));

        if ($licenseKey === '') {
            $this->error('Set MAXMIND_LICENSE_KEY in your .env file, or pass --license-key.');

            return self::INVALID;
        }

        $edition = trim((string) $this->option('edition'));

        if ($edition === '') {
            $this->error('The --edition option cannot be empty.');

            return self::INVALID;
        }

        $databasePath = (string) config('shop.visitor_location.database_path');

        if ($databasePath === '') {
            $this->error('Configure shop.visitor_location.database_path before running this command.');

            return self::INVALID;
        }

        $downloadUrl = (string) config('shop.visitor_location.download_url');
        $targetDirectory = dirname($databasePath);
        $workingDirectory = $targetDirectory.'/geoip-update-'.Str::uuid();

        File::ensureDirectoryExists($workingDirectory);

        try {
            $archivePath = $this->downloadDatabase($downloadUrl, $edition, $licenseKey, $workingDirectory);
            $extractedDatabasePath = $this->extractDatabase($archivePath, $workingDirectory, $edition);

            File::ensureDirectoryExists($targetDirectory);

            $temporaryDatabasePath = $databasePath.'.tmp-'.Str::uuid();

            File::copy($extractedDatabasePath, $temporaryDatabasePath);
            File::move($temporaryDatabasePath, $databasePath);
        } catch (Throwable $e) {
            $this->error('GeoIP database update failed: '.$e->getMessage());

            return self::FAILURE;
        } finally {
            File::deleteDirectory($workingDirectory);
        }

        $this->info('GeoIP database installed: '.$databasePath);

        return self::SUCCESS;
    }

    private function downloadDatabase(string $downloadUrl, string $edition, string $licenseKey, string $workingDirectory): string
    {
        $this->info('Downloading '.$edition.' from MaxMind...');

        $response = Http::timeout(120)->get($downloadUrl, [
            'edition_id' => $edition,
            'license_key' => $licenseKey,
            'suffix' => 'tar.gz',
        ]);

        if ($response->failed()) {
            throw new \RuntimeException('MaxMind returned HTTP '.$response->status().'.');
        }

        $archivePath = $workingDirectory.'/'.$edition.'.tar.gz';

        File::put($archivePath, $response->body());

        return $archivePath;
    }

    private function extractDatabase(string $archivePath, string $workingDirectory, string $edition): string
    {
        $this->info('Extracting database archive...');

        $tarPath = substr($archivePath, 0, -3);

        (new PharData($archivePath))->decompress();
        (new PharData($tarPath))->extractTo($workingDirectory, null, true);

        $expectedFilename = $edition.'.mmdb';
        $files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($workingDirectory));

        foreach ($files as $file) {
            if ($file->isFile() && $file->getFilename() === $expectedFilename) {
                return $file->getPathname();
            }
        }

        throw new \RuntimeException($expectedFilename.' was not found in the MaxMind archive.');
    }
}
