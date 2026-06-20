<?php

use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use Symfony\Component\Console\Command\Command;

function makeGeoIpUpdateTestArchive(string $databaseContents): string
{
    $path = 'GeoLite2-City_20260619/GeoLite2-City.mmdb';
    $size = strlen($databaseContents);

    $header = str_repeat("\0", 512);
    $header = substr_replace($header, str_pad($path, 100, "\0"), 0, 100);
    $header = substr_replace($header, sprintf('%07o', 0644)."\0", 100, 8);
    $header = substr_replace($header, sprintf('%07o', 0)."\0", 108, 8);
    $header = substr_replace($header, sprintf('%07o', 0)."\0", 116, 8);
    $header = substr_replace($header, sprintf('%011o', $size)."\0", 124, 12);
    $header = substr_replace($header, sprintf('%011o', 0)."\0", 136, 12);
    $header = substr_replace($header, str_repeat(' ', 8), 148, 8);
    $header = substr_replace($header, '0', 156, 1);
    $header = substr_replace($header, "ustar\0", 257, 6);
    $header = substr_replace($header, '00', 263, 2);

    $checksum = array_sum(array_map('ord', str_split($header)));
    $header = substr_replace($header, sprintf('%06o', $checksum)."\0 ", 148, 8);
    $padding = str_repeat("\0", (512 - ($size % 512)) % 512);

    return gzencode($header.$databaseContents.$padding.str_repeat("\0", 1024));
}

function geoIpUpdateTestDatabasePath(): array
{
    $directory = sys_get_temp_dir().'/geoip-update-test-'.uniqid();

    return [$directory, $directory.'/GeoLite2-City.mmdb'];
}

it('fails when the MaxMind license key is missing', function () {
    Config::set('shop.visitor_location.license_key', null);
    Http::fake();

    $this->artisan('geoip:update')
        ->expectsOutputToContain('Set MAXMIND_LICENSE_KEY')
        ->assertExitCode(Command::INVALID);

    Http::assertNothingSent();
});

it('downloads and installs the GeoLite2 City database', function () {
    [$directory, $databasePath] = geoIpUpdateTestDatabasePath();

    try {
        Config::set('shop.visitor_location.database_path', $databasePath);
        Config::set('shop.visitor_location.license_key', 'test-license-key');
        Http::fake([
            'download.maxmind.com/*' => Http::response(makeGeoIpUpdateTestArchive('fake-mmdb'), 200),
        ]);

        $this->artisan('geoip:update')
            ->expectsOutputToContain('Downloading GeoLite2-City from MaxMind')
            ->expectsOutputToContain('GeoIP database installed: '.$databasePath)
            ->assertSuccessful();

        expect(File::get($databasePath))->toBe('fake-mmdb');

        Http::assertSent(function ($request): bool {
            parse_str(parse_url($request->url(), PHP_URL_QUERY) ?: '', $query);

            return $query['edition_id'] === 'GeoLite2-City'
                && $query['license_key'] === 'test-license-key'
                && $query['suffix'] === 'tar.gz';
        });
    } finally {
        File::deleteDirectory($directory);
    }
});

it('fails when MaxMind rejects the download request', function () {
    [$directory, $databasePath] = geoIpUpdateTestDatabasePath();

    try {
        Config::set('shop.visitor_location.database_path', $databasePath);
        Config::set('shop.visitor_location.license_key', 'test-license-key');
        Http::fake([
            'download.maxmind.com/*' => Http::response('forbidden', 403),
        ]);

        $this->artisan('geoip:update')
            ->expectsOutputToContain('GeoIP database update failed: MaxMind returned HTTP 403.')
            ->assertFailed();

        expect(File::exists($databasePath))->toBeFalse();
    } finally {
        File::deleteDirectory($directory);
    }
});
