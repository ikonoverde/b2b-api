<?php

/*
 * The deploy script installs node modules with `npm ci --omit=dev`, so the Inertia SSR
 * server on production only ever sees packages listed under `dependencies`. Vite leaves
 * every bare import in the SSR bundles unresolved for Node to load at render time, so a
 * package that drifts into `devDependencies` does not fail the build — it fails silently
 * at runtime, and Inertia quietly falls back to client-side rendering.
 */

/**
 * Package names imported by the built SSR bundles, excluding Node's own builtins.
 *
 * @return list<string>
 */
function ssrBundleImports(): array
{
    $files = array_merge(
        glob(base_path('bootstrap/ssr/*.js')) ?: [],
        glob(base_path('bootstrap/ssr/assets/*.js')) ?: [],
    );

    $packages = [];

    foreach ($files as $file) {
        preg_match_all('/(?:from|import)\s*["\']([^"\']+)["\']/', (string) file_get_contents($file), $matches);

        foreach ($matches[1] as $specifier) {
            if (str_starts_with($specifier, '.') || str_starts_with($specifier, '/') || str_starts_with($specifier, 'node:')) {
                continue;
            }

            preg_match('#^(@[^/]+/[^/]+|[^/]+)#', $specifier, $name);

            $packages[] = $name[1];
        }
    }

    $builtins = ['fs', 'path', 'http', 'https', 'url', 'stream', 'util', 'crypto', 'os', 'buffer', 'events', 'zlib'];

    return array_values(array_unique(array_diff($packages, $builtins)));
}

it('has built SSR bundles to inspect', function () {
    expect(ssrBundleImports())->not->toBeEmpty(
        'No imports found under bootstrap/ssr — run `npm run build:ssr` before relying on this test.'
    );
});

it('resolves every SSR bundle import from production dependencies', function () {
    $manifest = json_decode((string) file_get_contents(base_path('package.json')), true);

    $production = array_keys($manifest['dependencies'] ?? []);
    $development = array_keys($manifest['devDependencies'] ?? []);

    $missing = [];

    foreach (ssrBundleImports() as $package) {
        if (in_array($package, $production, true)) {
            continue;
        }

        $missing[] = in_array($package, $development, true)
            ? "{$package} is in devDependencies but is imported by the SSR bundles; move it to dependencies or it will be missing under `npm ci --omit=dev`."
            : "{$package} is imported by the SSR bundles but is not listed in package.json dependencies.";
    }

    $this->assertSame([], $missing, 'SSR imports unavailable to a production install:'.PHP_EOL.implode(PHP_EOL, $missing));
});
